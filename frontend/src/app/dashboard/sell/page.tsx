import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/ui/topnav";
import { SellForm } from "./SellForm";
import { Tag } from "lucide-react";

export default async function SellPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  if (token) {
    try {
      user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {}
  }
  if (!user) redirect("/");

  const db = getDbConnection();
  const [categories] = await db.query(
    `SELECT category_id, name FROM Categories ORDER BY name ASC`
  ) as any[];

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans">
      <TopNav userName={user.name} title="MarketPlace List Item" backLink="/dashboard" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 flex flex-col md:flex-row gap-8">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />

        {/* Left Side: Title & Info */}
        <div className="w-full md:w-1/3 pt-6">
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 font-serif mb-4">
              Create Listing
            </h2>
            <p className="text-slate-400">List an item for sale on the marketplace. Provide accurate details and condition status.</p>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
            <Tag className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="font-semibold text-lg text-white mb-2">Seller Guidelines</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>Be completely honest about item condition.</li>
              <li>Marketplace fees are applied post-transaction.</li>
              <li>Do not list prohibited goods.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form Data */}
        <div className="flex-1 bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <SellForm categories={categories} />
        </div>
      </main>
    </div>
  );
}
