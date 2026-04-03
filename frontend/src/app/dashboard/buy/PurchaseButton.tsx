"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { purchaseItem } from "@/app/actions/market";

export function PurchaseButton({ itemId, price }: { itemId: number, price: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    setIsLoading(true);
    setStatus("idle");
    const result = await purchaseItem(itemId, price);
    
    if (result.error) {
       setStatus("error");
       setMessage(result.error);
    } else {
       setStatus("success");
       setMessage("Purchased!");
    }
    setIsLoading(false);
  };

  if (status === "success") {
    return (
      <div className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
        {message}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {status === "error" && <span className="text-xs text-red-400">{message}</span>}
      <button 
        onClick={handlePurchase}
        disabled={isLoading}
        className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 px-4 py-2 rounded-full transition-colors active:scale-95 border border-white/10 flex items-center justify-center min-w-[90px]"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Purchase"}
      </button>
    </div>
  );
}
