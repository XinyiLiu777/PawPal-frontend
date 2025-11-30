"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Message type
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm PawPal 🐾 Your pet care AI assistant. Ask me anything about pet health, behavior, training, or nutrition!",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! Something went wrong. Please try again 🐾",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ backgroundColor: "#FFF8F0" }} // warm cream
    >
      {/* ---------------- Sidebar ---------------- */}
      <aside
        className="w-60 border-r border-[#FFE5D8] p-4 flex flex-col gap-4"
        style={{ backgroundColor: "#FFF3EB" }}
      >
        <h2 className="text-lg font-bold text-[#FF8F77] flex items-center gap-2">
          🐾 PawPal
        </h2>

        <button className="rounded-xl bg-[#FFD6C8] text-[#5A3A32] px-3 py-2 shadow-sm hover:bg-[#FFC8BA] text-sm">
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto mt-2 flex flex-col gap-2 text-sm">
          <div className="p-2 rounded-lg bg-white border border-[#FFE5D8] shadow-sm">
            My first chat
          </div>
        </div>
      </aside>

      {/* ---------------- Main Chat Window ---------------- */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card
          className="w-full max-w-2xl h-[80vh] flex flex-col rounded-3xl shadow-lg border-[#FFE5D8]"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-[#FF8F77] flex items-center justify-center gap-2">
              <span>🐾</span> PawPal – Pet Care AI <span>🐶</span>
            </CardTitle>
            <p className="text-sm text-[#8A6F63]">
              Friendly pet guidance anytime you need 💛
            </p>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden px-4 pb-2">
            <ScrollArea className="h-full pr-2">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[75%] ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar className="h-9 w-9 border border-[#FFD6C8] bg-[#FFF3EF]">
                        <AvatarFallback className="text-[#FF8F77]">
                          {message.role === "assistant" ? "PP" : "You"}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          message.role === "user"
                            ? "bg-[#FFDACD] text-[#5A3A32]"
                            : "bg-[#F7F3F0] text-[#5A5A5A]"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[75%]">
                      <Avatar className="h-9 w-9 border border-[#FFD6C8] bg-[#FFF3EF]">
                        <AvatarFallback className="text-[#FF8F77]">
                          PP
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-3 rounded-2xl bg-[#F7F3F0] shadow-sm">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-[#C9B7B1] animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-[#C9B7B1] animate-bounce delay-75" />
                          <div className="h-2 w-2 rounded-full bg-[#C9B7B1] animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t border-[#FFE5D8] pt-3">
            <form onSubmit={sendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Ask PawPal anything about pet care... 🐱🐶"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-full border-[#FFD6C8] bg-[#FFF5EF] focus-visible:ring-[#FFB7A5]"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading}
                className="rounded-full bg-[#FF8F77] hover:bg-[#FF7A63]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
