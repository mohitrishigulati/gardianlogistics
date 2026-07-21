"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { chatbotWelcome } from "@/data/chatbot-responses";
import { getChatbotReply, getSuggestedQuestions, buildWhatsAppUrl } from "@/lib/chat/chatbot";
import { siteConfig } from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface ChatWidgetProps {
  contextMessage?: string;
}

export function ChatWidget({ contextMessage }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          text: chatbotWelcome,
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply =
        trimmed.toLowerCase().includes("whatsapp") || trimmed.toLowerCase().includes("support")
          ? "Tap the green **Chat on WhatsApp** button below to connect with our team. Include your AWB or booking ID for faster help."
          : getChatbotReply(trimmed);

      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, role: "bot", text: reply },
      ]);
      setTyping(false);
    }, 600);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const whatsappMessage =
    contextMessage ??
    "Hi Gardian Logistics, I need assistance with my shipment.";

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
        {open && (
          <div className="flex h-[min(520px,calc(100vh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-elevated">
            {/* Header */}
            <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-lg">
                  🤖
                </div>
                <div>
                  <p className="font-semibold">Gardian Assistant</p>
                  <p className="text-xs text-navy-300">Auto-replies · WhatsApp support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-navy-300 hover:bg-navy-800 hover:text-white"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-navy-900 text-white"
                        : "rounded-bl-md border border-navy-100 bg-white text-navy-800 shadow-sm"
                    }`}
                  >
                    {msg.text.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-navy-100 bg-white px-4 py-3 shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="flex gap-2 overflow-x-auto border-t border-navy-100 bg-white px-3 py-2">
              {getSuggestedQuestions().map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="shrink-0 rounded-full border border-navy-200 bg-surface px-3 py-1 text-xs text-navy-700 hover:border-accent-400 hover:bg-accent-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="border-t border-navy-100 bg-green-50 px-3 py-2">
              <a
                href={buildWhatsAppUrl(siteConfig.whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-navy-100 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/25"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppUrl(siteConfig.whatsapp, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-elevated transition hover:bg-green-700 hover:scale-105"
            aria-label="Chat on WhatsApp"
            title="WhatsApp Support"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-2xl text-white shadow-elevated transition hover:bg-navy-800 hover:scale-105"
            aria-label={open ? "Close assistant" : "Open assistant"}
          >
            {open ? "✕" : "💬"}
          </button>
        </div>
      </div>
    </>
  );
}
