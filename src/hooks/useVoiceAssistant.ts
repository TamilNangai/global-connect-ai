import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

// Detect language from SpeechRecognition or text patterns
function detectLanguageFromText(text: string): string {
  // Simple heuristic based on common words
  const patterns: [RegExp, string][] = [
    [/\b(el|la|los|las|es|está|como|qué|por|para)\b/i, "es"],
    [/\b(le|la|les|est|sont|avec|pour|dans|une)\b/i, "fr"],
    [/\b(der|die|das|ist|und|ein|eine|nicht|ich)\b/i, "de"],
    [/\b(il|lo|la|è|sono|che|per|con|una)\b/i, "it"],
    [/\b(o|a|os|as|é|está|com|para|uma)\b/i, "pt"],
    [/[\u0600-\u06FF]/, "ar"],
    [/[\u0900-\u097F]/, "hi"],
    [/[\u4e00-\u9fff]/, "zh"],
    [/[\u3040-\u309f\u30a0-\u30ff]/, "ja"],
    [/[\uac00-\ud7af]/, "ko"],
  ];
  
  for (const [pattern, lang] of patterns) {
    if (pattern.test(text)) return lang;
  }
  return "en";
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

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sessionId = useRef(getSessionId());
  const isActiveRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);

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
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("session_id", sessionId.current)
      .is("ended_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

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
      .insert({ session_id: sessionId.current, language: detectedLanguage })
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
  const speak = useCallback((text: string, lang: string) => {
    return new Promise<void>((resolve) => {
      if (!synthRef.current) { resolve(); return; }
      
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to find a matching voice
      const voices = synthRef.current.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.startsWith("en"));
      if (matchingVoice) utterance.voice = matchingVoice;
      
      // Adjust tone based on sentiment
      if (sentiment === "positive") {
        utterance.pitch = 1.1;
        utterance.rate = 1.05;
      } else if (sentiment === "negative") {
        utterance.pitch = 0.9;
        utterance.rate = 0.95;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      synthRef.current.speak(utterance);
    });
  }, [sentiment]);

  // Stream AI response
  const getAIResponse = useCallback(async (userText: string, convId: string) => {
    setIsProcessing(true);
    setError(null);

    const userSentiment = detectSentiment(userText);
    setSentiment(userSentiment);
    options.onSentimentChange?.(userSentiment);

    const lang = detectLanguageFromText(userText);
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
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
        await speak(fullResponse, lang);

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

  // Start speech recognition
  const startRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = detectedLanguage || "en-US";
    recognition.maxAlternatives = 1;

    let silenceTimer: ReturnType<typeof setTimeout>;
    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setCurrentTranscript(finalTranscript || interim);

      // Reset silence timer
      clearTimeout(silenceTimer);
      if (finalTranscript.trim()) {
        silenceTimer = setTimeout(() => {
          if (finalTranscript.trim() && isActiveRef.current) {
            recognition.stop();
            setIsListening(false);
            setCurrentTranscript("");
            ensureConversation().then(convId => {
              if (convId) getAIResponse(finalTranscript.trim(), convId);
            });
          }
        }, 1500); // 1.5s silence = end of utterance
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        // Restart if still active
        if (isActiveRef.current && !isSpeaking) {
          setTimeout(() => startRecognition(), 500);
        }
        return;
      }
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if conversation is active and not speaking/processing
      if (isActiveRef.current && !isSpeaking && !isProcessing) {
        setTimeout(() => startRecognition(), 300);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [detectedLanguage, ensureConversation, getAIResponse, isSpeaking, isProcessing]);

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

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
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
  };
}
