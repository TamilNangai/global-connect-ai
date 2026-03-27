import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Generate a persistent session ID for anonymous users
const getSessionId = (): string => {
  let id = localStorage.getItem("unispeak_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("unispeak_session_id", id);
  }
  return id;
};

type Message = { role: "user" | "assistant"; content: string };

interface UseVoiceAssistantOptions {
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
  onSentimentChange?: (sentiment: string) => void;
  onLanguageChange?: (lang: string) => void;
}

// Simple sentiment detection from text
function detectSentiment(text: string): string {
  const lower = text.toLowerCase();
  const positiveWords = ["happy", "great", "love", "amazing", "wonderful", "fantastic", "excited", "thank", "good", "awesome", "glad", "joy", "feliz", "bien", "genial", "merci"];
  const negativeWords = ["sad", "angry", "hate", "terrible", "awful", "upset", "frustrated", "annoyed", "bad", "horrible", "worried", "scared", "triste", "mal", "horrible"];

  const posCount = positiveWords.filter(w => lower.includes(w)).length;
  const negCount = negativeWords.filter(w => lower.includes(w)).length;

  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  return "neutral";
}

// FastText-based language detection via server (with fallback to regex)
async function detectLanguageServer(text: string): Promise<{ language: string; confidence: number }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lang-detect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ text: text.trim() }),
      }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Language detection service error, falling back to regex:", error);
  }

  // Fallback to regex-based detection (176 langs via FastText, or local patterns)
  const patterns: [RegExp, string][] = [
    [/\b(el|la|los|las|es|está|como|qué|por|para|muy|más)\b/i, "es"],
    [/\b(le|la|les|est|sont|avec|pour|dans|une|comment)\b/i, "fr"],
    [/\b(der|die|das|ist|und|ein|eine|nicht|ich|wie)\b/i, "de"],
    [/\b(il|lo|la|è|sono|che|per|con|una|come)\b/i, "it"],
    [/\b(o|a|os|as|é|está|com|para|uma|como)\b/i, "pt"],
    [/[\u0600-\u06FF]/, "ar"],
    [/[\u0900-\u097F]/, "hi"],
    [/[\u4e00-\u9fff]/, "zh"],
    [/[\u3040-\u309f\u30a0-\u30ff]/, "ja"],
    [/[\uac00-\ud7af]/, "ko"],
  ];

  const lower = text.toLowerCase();
  for (const [pattern, lang] of patterns) {
    if (pattern.test(text)) {
      const matches = (text.match(pattern) || []).length;
      const confidence = Math.min(0.95, 0.7 + matches * 0.05);
      return { language: lang, confidence };
    }
  }

  return { language: "en", confidence: 0.5 };
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("en");
  const [sentiment, setSentiment] = useState("neutral");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sessionId = useRef(getSessionId());
  const isActiveRef = useRef(false);

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  // Create or resume conversation
  const ensureConversation = useCallback(async () => {
    if (conversationId) return conversationId;

    // Try to find an existing recent conversation
    const query = supabase
      .from("conversations")
      .select("id")
      .is("ended_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (user) {
      query.eq("user_id", user.id);
    } else {
      query.eq("session_id", sessionId.current);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      setConversationId(existing.id);
      // Load existing messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", existing.id)
        .order("created_at", { ascending: true });
      if (msgs) {
        const loaded = msgs.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
        setMessages(loaded);
      }
      return existing.id;
    }

    const { data: newConv } = await supabase
      .from("conversations")
      .insert({
        session_id: sessionId.current,
        user_id: user?.id || null,
        language: detectedLanguage
      })
      .select("id")
      .single();

    if (newConv) {
      setConversationId(newConv.id);
      return newConv.id;
    }
    return null;
  }, [conversationId, detectedLanguage]);

  // Save message to DB
  const saveMessage = useCallback(async (convId: string, role: string, content: string, lang?: string, sent?: string) => {
    await supabase.from("messages").insert({
      conversation_id: convId,
      role,
      content,
      language: lang,
      sentiment: sent,
    });
  }, []);

  // TTS with language-matched voice
  const speak = useCallback((text: string, lang: string, sent: string = sentiment) => {
    return new Promise<void>((resolve) => {
      if (!synthRef.current) { resolve(); return; }

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Map language codes for TTS
      const voiceMap: Record<string, string> = {
        en: "en-US",
        ta: "ta-IN",
        hi: "hi-IN",
        fr: "fr-FR",
        es: "es-ES",
        de: "de-DE",
        it: "it-IT",
        pt: "pt-PT",
        zh: "zh-CN",
        ja: "ja-JP",
        ko: "ko-KR",
        ar: "ar-SA",
      };

      utterance.lang = voiceMap[lang] || "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Adjust pitch/rate based on sentiment
      if (sent === "positive") { utterance.pitch = 1.1; utterance.rate = 1.05; }
      else if (sent === "negative") { utterance.pitch = 0.9; utterance.rate = 0.95; }


      const voices = synthRef.current.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang)) || voices.find(v => v.lang.startsWith("en"));
      if (matchingVoice) utterance.voice = matchingVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };

      synthRef.current.speak(utterance);
    });
  }, [sentiment]);

  // const speak = useCallback((text: string, lang: string) => {
  //   return new Promise<void>((resolve) => {
  //     if (!synthRef.current) { resolve(); return; }

  //     // Cancel any ongoing speech
  //     synthRef.current.cancel();

  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.lang = lang;
  //     utterance.rate = 1.0;
  //     utterance.pitch = 1.0;

  //     // Try to find a matching voice
  //     const voices = synthRef.current.getVoices();
  //     const matchingVoice = voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.startsWith("en"));
  //     if (matchingVoice) utterance.voice = matchingVoice;

  //     // Adjust tone based on sentiment
  //     if (sentiment === "positive") {
  //       utterance.pitch = 1.1;
  //       utterance.rate = 1.05;
  //     } else if (sentiment === "negative") {
  //       utterance.pitch = 0.9;
  //       utterance.rate = 0.95;
  //     }

  //     utterance.onstart = () => setIsSpeaking(true);
  //     utterance.onend = () => {
  //       setIsSpeaking(false);
  //       resolve();
  //     };
  //     utterance.onerror = () => {
  //       setIsSpeaking(false);
  //       resolve();
  //     };

  //     synthRef.current.speak(utterance);
  //   });
  // }, [sentiment]);


  const handleUserSpeech = async (userText: string, convId: string) => {
    console.log("User said:", userText);

    const { language: lang } = await detectLanguageServer(userText);

    console.log("Detected language:", lang);

    setDetectedLanguage(lang);
    options.onLanguageChange?.(lang);

    // call existing AI function
    await getAIResponse(userText, convId);
  };


  // Stream AI response
  const getAIResponse = useCallback(async (userText: string, convId: string) => {
    setIsProcessing(true);
    setError(null);

    const userSentiment = detectSentiment(userText);
    setSentiment(userSentiment);
    options.onSentimentChange?.(userSentiment);

    const { language: lang, confidence: langConfidence } = await detectLanguageServer(userText);
    setDetectedLanguage(lang);
    options.onLanguageChange?.(lang);

    // Save user message
    await saveMessage(convId, "user", userText, lang, userSentiment);

    const allMessages = [...messagesRef.current, { role: "user" as const, content: userText }];
    setMessages(allMessages);
    options.onTranscript?.(userText);

    // Stream from edge function
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
          },
          body: JSON.stringify({
            messages: allMessages.slice(-20), // Last 20 messages for context
            language: lang,
          }),
          signal: controller.signal,
        }
      );

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let textBuffer = "";
      const activeRef = isActiveRef;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: fullResponse } : m);
                }
                return [...prev, { role: "assistant", content: fullResponse }];
              });
            }
          } catch { /* partial chunk */ }
        }
      }

      if (fullResponse) {
        await saveMessage(convId, "assistant", fullResponse, lang, sentiment);
        options.onResponse?.(fullResponse);

        // Update analytics
        await supabase.from("assistant_analytics").insert({
          conversation_id: convId,
          session_id: sessionId.current,
          language: lang,
          message_count: 2,
          sentiment: userSentiment,
        });

        setIsProcessing(false);

        // Speak the response
        await speak(fullResponse, lang, userSentiment);

        // Resume listening after speaking
        if (isActiveRef.current) {
          startRecognition();
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message);
        setIsProcessing(false);
        if (isActiveRef.current) startRecognition();
      }
    }
  }, [speak, saveMessage, options, sentiment]);

  // Start audio recording with silence detection
  const startRecognition = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analysis for silence detection
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudioBlob(audioBlob);
        }
        // Restart if still active
        if (isActiveRef.current && !isSpeaking && !isProcessing) {
          setTimeout(() => startRecognition(), 300);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);

      // Start silence detection
      detectSilence();
    } catch (err) {
      console.error("Error starting audio recording:", err);
      setError("Microphone access denied or not available");
    }
  }, []);

  // Detect silence in audio stream
  // const detectSilence = useCallback(() => {
  //   if (!analyserRef.current || !dataArrayRef.current) return;

  //   analyserRef.current.getByteFrequencyData(dataArrayRef.current);
  //   const volume = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;

  //   if (volume < 10) { // Threshold for silence
  //     if (!silenceTimerRef.current) {
  //       silenceTimerRef.current = setTimeout(() => {
  //         if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
  //           mediaRecorderRef.current.stop();
  //           setIsListening(false);
  //           silenceTimerRef.current = null;
  //         }
  //       }, 1500); // 1.5s silence
  //     }
  //   } else {
  //     if (silenceTimerRef.current) {
  //       clearTimeout(silenceTimerRef.current);
  //       silenceTimerRef.current = null;
  //     }
  //   }

  //   if (isActiveRef.current) {
  //     requestAnimationFrame(detectSilence);
  //   }
  // }, []);



  const detectSilence = useCallback(() => {
    // Make sure analyser exists
    if (!analyserRef.current) return;
    
    // Create fresh buffer for this call to avoid type conflicts
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    // Silence detection threshold
    if (volume < 10) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsListening(false);
            silenceTimerRef.current = null;
          }
        }, 1500); // 1.5s silence
      }
    } else {
      // Reset timer if sound detected
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }

    // Continue checking only if assistant is active
    if (isActiveRef.current) {
      requestAnimationFrame(detectSilence);
    }
  }, []); // ✅ No additional dependencies needed because refs are stable


  // Process recorded audio with Whisper
  const processAudioBlob = async (audioBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    // Supabase v2: get current session
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) throw new Error("User not authenticated");

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whisper-stt`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "STT failed");
    }

    const { text, language } = await response.json();
    return text;
  } catch (err: any) {
    console.error("Whisper processing error:", err);
    return "";
  }
};



  // const processAudioBlob = useCallback(async (audioBlob: Blob) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('audio', audioBlob, 'recording.webm');

  //     const response = await fetch(
  //       `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whisper-stt`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       const errData = await response.json().catch(() => ({}));
  //       throw new Error(errData.error || 'STT failed');
  //     }

  //     const { text, language } = await response.json();
  //     if (text && text.trim()) {
  //       setCurrentTranscript(text);
  //       const convId = await ensureConversation();
  //       if (convId) {
  //         await handleUserSpeech(text.trim(), convId);

  //       }
  //     }
  //   } catch (err: any) {
  //     console.error('Whisper processing error:', err);
  //     setError('Speech-to-text failed');
  //   } finally {
  //     setCurrentTranscript('');
  //   }
  // }, [ensureConversation, getAIResponse]);

  // Connect (start hands-free conversation)
  const connect = useCallback(async () => {
    setError(null);
    isActiveRef.current = true;
    setIsConnected(true);

    // Load voices
    speechSynthesis.getVoices();

    await ensureConversation();
    startRecognition();
  }, [ensureConversation, startRecognition]);

  // Disconnect
  const disconnect = useCallback(() => {
    isActiveRef.current = false;
    setIsConnected(false);
    setIsListening(false);
    setCurrentTranscript("");

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // End conversation
    if (conversationId) {
      supabase.from("conversations").update({ ended_at: new Date().toISOString() }).eq("id", conversationId);
    }
  }, [conversationId]);


  // Manual AI response trigger (point 4)
  const generateAIResponse = useCallback(async (text: string, lang?: string) => {
    const convId = await ensureConversation();
    if (!convId) return;

    const detectedLang = lang || (await detectLanguageServer(text)).language;
    setDetectedLanguage(detectedLang);

    await getAIResponse(text, convId);
  }, [ensureConversation, getAIResponse]);

  // Manual TTS trigger (point 5)
  const speakText = useCallback(async (text: string, lang?: string) => {
    // If no explicit lang provided, detect it from the typed text
    let resolvedLang = lang;
    if (!resolvedLang) {
      const { language: autoLang } = await detectLanguageServer(text);
      resolvedLang = autoLang;
      setDetectedLanguage(autoLang);          // ← updates the language badge in UI
      options.onLanguageChange?.(autoLang);
    }
    await speak(text, resolvedLang);
  }, [speak, detectedLanguage, options]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    isProcessing,
    isConnected,
    messages,
    currentTranscript,
    detectedLanguage,
    sentiment,
    error,
    connect,
    disconnect,
    generateAIResponse, // ✅ add this
    speakText,          // ✅ add this
  };
}
