"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ShoppingBag, User, IndianRupee } from "lucide-react";
import { acceptOrder } from "@/app/actions/market";
import { useRouter } from "next/navigation";

export function AcceptOrderRow({ order }: { order: any }) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    if (!confirm(`Accept order for "${order.title}" from ${order.buyer_name}?`)) return;
    setIsAccepting(true);
    const result = await acceptOrder(order.order_id, order.item_id);
    setIsAccepting(false);
    if (result.error) {
      alert(result.error);
    } else {
      setAccepted(true);
      setTimeout(() => router.refresh(), 1500);
    }
  };

  return (
    <div className="bg-black/40 border border-amber-500/20 relative p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 overflow-hidden rounded-xl hover:bg-white/5 transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-amber-500" />

      <div className="pl-4 flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-white truncate max-w-lg">{order.title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {order.buyer_name}
          </span>
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" /> {parseFloat(order.price).toLocaleString()}
          </span>
          <span className="text-slate-600">Order #{order.order_id}</span>
        </div>
      </div>

      <div className="pl-4 md:pl-0 shrink-0">
        {accepted ? (
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" /> Order Accepted!
          </div>
        ) : (
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isAccepting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
            {isAccepting ? "Accepting..." : "Accept Order"}
          </button>
        )}
      </div>
    </div>
  );
}
