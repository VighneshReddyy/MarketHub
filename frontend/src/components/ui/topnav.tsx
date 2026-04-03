"use client";

import { LogOut, ArrowLeft, Hexagon, UserCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { useState } from "react";

export function TopNav({ userName, title, backLink }: { userName: string, title?: string, backLink?: string }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="flex-none p-6 md:px-12 flex items-center justify-between z-50 relative border-b border-white/5 bg-black/40 backdrop-blur-md w-full">
      <div className="flex items-center gap-6">
        {backLink ? (
          <Link href={backLink} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-white hover:bg-white/10 rounded-full h-10 w-10 shrink-0")}>
             <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
            <Hexagon className="h-5 w-5 text-purple-400" />
          </div>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
          {title || "MarketHub"}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div className="relative">
           <Button 
             variant="ghost" 
             className="text-slate-200 hover:text-white border border-white/5 hover:bg-white/10 rounded-xl px-4 flex gap-2"
             onClick={() => setShowProfile(!showProfile)}
           >
             <UserCircle className="w-5 h-5" /> 
             <span className="hidden md:inline">{userName}</span>
           </Button>
           
           {showProfile && (
             <div className="absolute top-14 right-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <Link href="/dashboard/notifications" className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left">
                  View Notification
                </Link>
                <Link href="/dashboard/ratings" className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left">
                  My Ratings
                </Link>
                <Link href="/dashboard/manage" className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left">
                  Purchases
                </Link>
                <hr className="border-white/5 my-1" />
                <form action={logout}>
                   <button type="submit" className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                     <LogOut className="w-4 h-4 mr-2" /> Log Out
                   </button>
                </form>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
