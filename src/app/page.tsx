"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#FFE5D8] w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#FF8F77] mb-4">
          🐾 Welcome to PawPal
        </h1>
        <p className="text-[#8A6F63] text-sm mb-6">
          Your friendly pet care AI assistant 💛
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name..."
            className="p-3 rounded-xl border border-[#FFD6C8] bg-[#FFF5EF]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-[#FF8F77] text-white hover:bg-[#FF7A63] transition"
          >
            Start Chatting 🐶
          </button>
        </form>
      </div>
    </div>
  );
}
