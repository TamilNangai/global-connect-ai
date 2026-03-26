import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, MessageSquare, Volume2, Globe, Brain, Minimize2 } from "lucide-react";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { ScrollArea } from "@/components/ui/scroll-area";

const sentimentEmoji: Record<string, string> = {
  positive: "😊",
  negative: "😔",
  neutral: "🤖",
};

const langNames: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
  zh: "Chinese", ja: "Japanese", ko: "Korean",
};

const VoiceAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useVoiceAssistant();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTranscript]);

  const handleToggle = () => {
    if (isOpen) {
      disconnect();
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (e) {
      console.error(e);
    }
  };

  // Pulsing animation for the FAB
  const pulseVariants = {
    idle: { scale: 1, boxShadow: "0 4px 24px rgba(59, 130, 246, 0.3)" },
    listening: {
      scale: [1, 1.08, 1],
      boxShadow: [
        "0 4px 24px rgba(59, 130, 246, 0.3)",
        "0 4px 40px rgba(59, 130, 246, 0.6)",
        "0 4px 24px rgba(59, 130, 246, 0.3)",
      ],
      transition: { duration: 1.5, repeat: Infinity },
    },
    speaking: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 4px 24px rgba(16, 185, 129, 0.3)",
        "0 4px 40px rgba(16, 185, 129, 0.6)",
        "0 4px 24px rgba(16, 185, 129, 0.3)",
      ],
      transition: { duration: 0.8, repeat: Infinity },
    },
  };

  const getAnimationState = () => {
    if (isSpeaking) return "speaking";
    if (isListening) return "listening";
    return "idle";
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        variants={pulseVariants}
        animate={isOpen ? "idle" : getAnimationState()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
          isOpen
            ? "bg-destructive"
            : isSpeaking
              ? "bg-emerald-500"
              : isListening
                ? "bg-royal"
                : "bg-gradient-to-br from-royal to-azure"
        }`}
        aria-label={isOpen ? "Close assistant" : "Open voice assistant"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col"
            style={{ maxHeight: "min(580px, calc(100vh - 140px))" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-royal to-azure p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  {isConnected && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"
                    />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">UniSpeak AI</div>
                  <div className="text-xs text-white/70 flex items-center gap-1.5">
                    {isConnected ? (
                      <>
                        {isSpeaking && <><Volume2 className="w-3 h-3" /> Speaking...</>}
                        {isListening && <><Mic className="w-3 h-3 animate-pulse" /> Listening...</>}
                        {isProcessing && <><Brain className="w-3 h-3 animate-spin" /> Thinking...</>}
                        {!isSpeaking && !isListening && !isProcessing && "Connected"}
                      </>
                    ) : "Ready to chat"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isConnected && (
                  <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                    <Globe className="w-3 h-3" />
                    {langNames[detectedLanguage] || detectedLanguage}
                  </div>
                )}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sentiment indicator */}
            {isConnected && sentiment !== "neutral" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5 shrink-0"
              >
                <span>{sentimentEmoji[sentiment]}</span>
                <span>Mood: {sentiment}</span>
              </motion.div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-3">
                {!isConnected && messages.length === 0 && (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-royal/10 flex items-center justify-center mx-auto mb-4"
                    >
                      <Mic className="w-8 h-8 text-royal" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-1">Hands-Free Voice Assistant</h3>
                    <p className="text-xs text-muted-foreground mb-4 px-4">
                      Tap the button below to start a voice conversation. I'll listen, respond, and remember our chat.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConnect}
                      className="bg-gradient-to-r from-royal to-azure text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg"
                    >
                      Start Conversation
                    </motion.button>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-royal text-white rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Live transcript */}
                {currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm bg-royal/20 text-royal rounded-br-md italic">
                      {currentTranscript}...
                    </div>
                  </motion.div>
                )}

                {/* Processing indicator */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Footer */}
            {isConnected && (
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Voice activity visualization */}
                    <div className="flex items-center gap-0.5 h-6">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={isListening ? {
                            height: [4, 12 + Math.random() * 12, 4],
                          } : { height: 4 }}
                          transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                          className={`w-1 rounded-full ${
                            isListening ? "bg-royal" : isSpeaking ? "bg-emerald-500" : "bg-muted-foreground/30"
                          }`}
                          style={{ minHeight: 4 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Paused"}
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-xs text-destructive hover:text-destructive/80 transition-colors font-medium"
                  >
                    End
                  </button>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="bg-destructive/10 text-destructive text-xs px-4 py-2 shrink-0"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Minimized state */}
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-6 z-50 bg-card rounded-full shadow-elevated border border-border px-4 py-2 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-royal" />
            <span className="text-sm font-medium text-foreground">
              {messages.length} messages
            </span>
            {isListening && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-royal"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistantWidget;
