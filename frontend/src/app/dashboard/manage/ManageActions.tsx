"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteListing } from "@/app/actions/market";
import { useRouter } from "next/navigation";

export function ManageActions({ itemId }: { itemId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Execute asset removal?")) return;
    setIsDeleting(true);
    await deleteListing(itemId);
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="font-jetbrains text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50 group flex items-center justify-end"
      title="Delete Listing"
    >
      {isDeleting ? (
        <span className="flex items-center gap-2 text-red-500"><Loader2 className="w-3 h-3 animate-spin" /> PURGING...</span>
      ) : (
        <span className="group-hover:shadow-[0_0_10px_rgba(239,68,68,0.8)] px-2 py-1 rounded transition-shadow">[ REMOVE ]</span>
      )}
    </button>
  );
}
