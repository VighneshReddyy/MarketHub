"use client";

import * as React from "react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, Shield } from "lucide-react";

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

          setMessage({ text: "Login successful. Redirecting...", type: "success" });
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full" style={{
      background: 'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.14) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%), #0a0a0f'
    }}>
      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[60%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[350px] h-[350px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[250px] h-[250px] rounded-full bg-purple-600/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl backdrop-blur-xl shadow-2xl p-8 flex flex-col items-center border border-white/8" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
      }}>
        
        {/* Toggle Nav */}
        <div className="w-full flex justify-between gap-1 mb-8 bg-white/5 rounded-full p-1 border border-white/8">
           <button onClick={() => { setTab("login"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'login' ? 'bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 text-white shadow border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Sign In</button>
           <button onClick={() => { setTab("register"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'register' ? 'bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 text-white shadow border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Register</button>
           <button onClick={() => { setTab("admin"); setMessage(null); }} className={`flex-1 text-xs py-2 rounded-full font-medium transition-all ${tab === 'admin' ? 'bg-red-500/20 text-red-400 shadow border border-red-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Admin</button>
        </div>

        {/* Logo */}
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg border ${tab === 'admin' ? 'bg-red-500/10 border-red-500/20' : 'border-white/10'}`} style={tab !== 'admin' ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))' } : {}}>
          {tab === 'admin' ? <Shield className="w-7 h-7 text-red-400" /> : <ShoppingBag className="w-7 h-7 text-white" />}
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-1 text-center tracking-tight">
          {tab === "login" ? "Welcome back" : tab === "register" ? "Create an account" : "Admin Access"}
        </h2>
        <p className="text-sm text-slate-400 mb-6 text-center">
          {tab === "login" ? "Sign in to your MarketHub account" : tab === "register" ? "Join the MarketHub marketplace" : "Restricted to administrators only"}
        </p>
        
        {/* Form */}
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          
          {message && (
             <div className={`text-sm text-left p-3 rounded-lg border ${message.type === 'error' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
               {message.text}
             </div>
          )}

          <div className="w-full flex flex-col gap-3">
            {tab === "register" && (
              <input
                placeholder="Full Name"
                type="text"
                value={name}
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              placeholder={tab === 'admin' ? "Admin Email" : "Email Address"}
              type="email"
              value={email}
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 ${tab === 'admin' ? 'focus:ring-red-500/50' : 'focus:ring-indigo-500/50'} transition-all`}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className={`w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 ${tab === 'admin' ? 'focus:ring-red-500/50' : 'focus:ring-indigo-500/50'} transition-all`}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <hr className="opacity-10 my-1" />
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-full shadow-lg transition-all mb-3 text-sm disabled:opacity-50 ${tab === 'admin' ? 'bg-red-500/80 hover:bg-red-500 text-white' : 'text-white hover:brightness-110'}`}
              style={tab !== 'admin' ? { background: 'linear-gradient(135deg, #6366f1, #06b6d4)' } : {}}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tab === "login" ? "Log In" : tab === "register" ? "Create Account" : "Sign In as Admin"}
            </button>
          </div>
        </form>
      </div>

      {/* Branding */}
      <div className="relative z-10 mt-10 flex flex-col items-center gap-2 opacity-50">
        <p className="text-xs text-slate-500 tracking-widest uppercase">MarketHub — Secure Platform</p>
      </div>
    </div>
  );
}
