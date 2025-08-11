"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";

export default function Home() {
  const { mutateAsync, isPending } = useLogin();
  const [email, setEmail] = useState("admin@remontada.com");
  const [password, setPassword] = useState("admin");

  async function handleLogin() {
    await mutateAsync({ email, password });
  }

  return (
      <main className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Login test</h1>
        <input
            className="border rounded px-3 py-2 w-full"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            className="border rounded px-3 py-2 w-full"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button
            onClick={handleLogin}
            disabled={isPending}
            className="rounded px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </main>
  );
}
