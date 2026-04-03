"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Tag, Bell, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClientDashboardGrid() {
  const cards = [
    { 
      label: "Purchase", 
      sublabel: "Buy Items", 
      route: "/dashboard/buy",
      color: "from-cyan-500/0 via-cyan-400/40 to-cyan-500/0",
      glowColor: "group-hover:bg-cyan-500/20",
      borderColor: "group-hover:border-cyan-400/50",
      Icon: ShoppingCart
    },
    { 
      label: "Sell", 
      sublabel: "List Item", 
      route: "/dashboard/sell",
      color: "from-fuchsia-500/0 via-fuchsia-500/50 to-fuchsia-500/0",
      glowColor: "group-hover:bg-fuchsia-500/20",
      borderColor: "group-hover:border-fuchsia-400/50",
      Icon: Tag
    },
    { 
      label: "Alerts", 
      sublabel: "Watchers", 
      route: "/dashboard/alerts",
      color: "from-amber-500/0 via-amber-400/40 to-amber-500/0",
      glowColor: "group-hover:bg-amber-500/20",
      borderColor: "group-hover:border-amber-400/50",
      Icon: Bell
    },
    { 
      label: "Manage", 
      sublabel: "My Sales", 
      route: "/dashboard/manage",
      color: "from-violet-500/0 via-violet-500/40 to-violet-500/0",
      glowColor: "group-hover:bg-violet-500/20",
      borderColor: "group-hover:border-violet-400/50",
      Icon: List
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mx-auto w-full max-w-4xl pt-10">
      {cards.map((card) => (
        <Link key={card.label} href={card.route}>
          <div 
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl",
              "border border-white/5 transition-all duration-500 ease-out",
              "hover:-translate-y-2 hover:shadow-2xl",
              "flex flex-col h-48 sm:h-56 p-6 cursor-pointer cursor-crosshair",
              card.borderColor
            )}
            style={{
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.02)"
            }}
          >
            {/* Inner Glow */}
            <div className={cn("absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100", card.glowColor)} />
            
            {/* Top-left Icon + Sublabel (Mono) */}
            <div className="flex items-center gap-2 relative z-10 text-white/50 group-hover:text-white/90 transition-colors">
              <card.Icon className="w-5 h-5" />
              <span className="font-mono text-xs tracking-wider uppercase">{card.sublabel}</span>
            </div>

            {/* Enormous Centered Label */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white/90 group-hover:text-white transition-all transform group-hover:scale-105 group-active:scale-95 duration-300">
                {card.label}
              </span>
            </div>

            {/* Aurora Leak at Bottom Edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-500" />
            <div className={cn("absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700", card.color)} />
          </div>
        </Link>
      ))}
    </div>
  );
}
