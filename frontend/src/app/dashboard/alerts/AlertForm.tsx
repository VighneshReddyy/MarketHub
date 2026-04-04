"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createAlert } from "@/app/actions/market";
import { useRouter } from "next/navigation";

export function AlertForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string, type: "error" | "success" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const result = await createAlert(formData);

    if (result.error) {
      setStatus({ text: result.error, type: "error" });
      setIsLoading(false);
    } else {
      setStatus({ text: "Alert saved successfully.", type: "success" });
      setTimeout(() => {
        setStatus(null);
        setIsLoading(false);
        formElement.reset();
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      {status && (
        <div className={`p-4 rounded border font-jetbrains text-sm tracking-widest uppercase ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/50' : 'bg-pink-500/10 text-pink-500 border-pink-500/50'}`}>
          {status.text}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-pink-400/80">Category</label>
        <select 
          name="category_id" 
          required 
          className="w-full bg-black/50 border-b border-pink-500/30 px-0 py-2 text-white font-jetbrains focus:outline-none focus:border-pink-500 transition-colors appearance-none"
        >
          <option value="" className="bg-[#0f0f13]">Select a category</option>
          {categories.map(c => (
            <option key={c.category_id} value={c.category_id} className="bg-[#0f0f13] text-pink-300">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-widest text-pink-400/80">Min Price (₹)</label>
          <input 
            name="min_price" 
            type="number" 
            min="0"
            placeholder="0" 
            className="w-full bg-transparent border-b border-pink-500/30 px-0 py-2 text-white font-jetbrains focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-widest text-pink-400/80">Max Price (₹)</label>
          <input 
            name="max_price" 
            type="number" 
            min="1"
            placeholder="No limit" 
            className="w-full bg-transparent border-b border-pink-500/30 px-0 py-2 text-white font-jetbrains focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-pink-400/80">Condition</label>
        <select 
          name="condition" 
          required 
          className="w-full bg-black/50 border-b border-pink-500/30 px-0 py-2 text-white font-jetbrains focus:outline-none focus:border-pink-500 transition-colors appearance-none"
        >
          <option value="any" className="bg-[#0f0f13]">Any condition</option>
          <option value="new" className="bg-[#0f0f13] text-cyan-400">New only</option>
          <option value="used" className="bg-[#0f0f13] text-amber-400">Used only</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-6 w-full font-jetbrains font-bold text-lg uppercase tracking-widest px-4 py-5 transition-all text-white disabled:opacity-50 overflow-hidden relative group bg-gradient-to-r from-pink-600 via-violet-600 to-blue-600 bg-[length:200%_auto] hover:bg-[position:100%_center]"
      >
        <div className="absolute inset-0 mix-blend-overlay opacity-0 group-active:opacity-100 transition-opacity bg-white scale-0 group-active:scale-x-100 duration-300 origin-center" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Set Alert"}
        </span>
      </button>
    </form>
  );
}
