"use client";

import * as React from "react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Box, Shield, Lock, Activity, Server } from "lucide-react";

export function ModernStunningSignIn() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register" | "admin">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "error" | "success" } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    if (tab === "login" || tab === "admin") {
      if (!email || !password) {
        setIsLoading(false);
        setMessage({ text: "Please enter your email and password.", type: "error" });
        return;
      }
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "login", email: email.trim(), password }),
        });
        const response = await res.json();
        
        if (!res.ok || response.error) {
          setMessage({ text: response.error || "Login failed", type: "error" });
          setIsLoading(false);
        } else {
          
          if (tab === "admin" && !response.is_admin) {
            setMessage({ text: "Access Denied: Not an administrator.", type: "error" });
            setIsLoading(false);
            return;
          }

          setMessage({ text: "Access Granted. Initializing...", type: "success" });
          if (response.is_admin && tab === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (err) {
        setIsLoading(false);
        setMessage({ text: "Network error occurred.", type: "error" });
      }
    } else {
      if (!name || !email || !password) {
        setIsLoading(false);
        setMessage({ text: "Please fill in all fields.", type: "error" });
        return;
      }
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "register", name: name.trim(), email: email.trim(), password }),
        });
        const response = await res.json();
        
        if (!res.ok || response.error) {
          setMessage({ text: response.error || "Registration failed", type: "error" });
          setIsLoading(false);
        } else {
          setMessage({ text: "Account created successfully! Redirecting...", type: "success" });
          router.push("/dashboard");
        }
      } catch (err) {
        setIsLoading(false);
        setMessage({ text: "Network error occurred.", type: "error" });
      }
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full rounded-xl">
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center border border-white/5">
        
        {/* Toggle Nav */}
        <div className="w-full flex justify-between gap-1 mb-8 bg-white/5 rounded-full p-1 border border-white/5">
           <button onClick={() => { setTab("login"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'login' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>User Login</button>
           <button onClick={() => { setTab("register"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'register' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Register</button>
           <button onClick={() => { setTab("admin"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'admin' ? 'bg-red-500/20 text-red-500 shadow border border-red-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Admin</button>
        </div>

        {/* Logo */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-6 shadow-lg border ${tab === 'admin' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
          {tab === 'admin' ? <Shield className="w-6 h-6 text-red-500" /> : <Box className="w-6 h-6 text-white" />}
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center tracking-tight">
          {tab === "login" ? "MarketHub Portal" : tab === "register" ? "Create Account" : "Secure System Admin"}
        </h2>
        
        {/* Form */}
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          
          {message && (
             <div className={`text-sm text-left p-3 rounded-lg border ${message.type === 'error' ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'}`}>
               {message.text}
             </div>
          )}

          <div className="w-full flex flex-col gap-3">
            {tab === "register" && (
              <input
                placeholder="Full Name"
                type="text"
                value={name}
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              placeholder={tab === 'admin' ? "Admin Email" : "Email Address"}
              type="email"
              value={email}
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 ${tab === 'admin' ? 'focus:ring-red-500/50' : 'focus:ring-white/30'}`}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder={tab === 'admin' ? "Secure Passphrase" : "Password"}
              type="password"
              value={password}
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 ${tab === 'admin' ? 'focus:ring-red-500/50' : 'focus:ring-white/30'}`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <hr className="opacity-10 my-1" />
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 font-medium px-5 py-3 rounded-full shadow transition mb-3 text-sm disabled:opacity-50 ${tab === 'admin' ? 'bg-red-500/80 hover:bg-red-500 text-white shadow-red-500/20' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === "login" ? "Initialize Login" : tab === "register" ? "Deploy Account" : "Access Database"}
            </button>
          </div>
        </form>
      </div>

      {/* Network Icons generic block */}
      <div className="relative z-10 mt-16 flex flex-col items-center justify-center opacity-40">
        <div className="flex gap-8 text-white/50 mb-4">
          <Shield className="w-6 h-6 hover:text-white transition-colors" />
          <Lock className="w-6 h-6 hover:text-white transition-colors" />
          <Activity className="w-6 h-6 hover:text-white transition-colors" />
          <Server className="w-6 h-6 hover:text-white transition-colors" />
        </div>
        <p className="text-xs uppercase tracking-widest text-white/30">
          Secured Enterprise Infrastructure
        </p>
      </div>
    </div>
  );
}
