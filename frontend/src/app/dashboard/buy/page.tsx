import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/ui/topnav";
import { Tag, MapPin, Search } from "lucide-react";
import { ProductRevealCardWrapper } from "./ProductRevealCardWrapper";

export default async function BuyPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  try {
    if (token) user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch (e) {
    user = null;
  }
  if (!user) redirect("/");

  const db = getDbConnection();
  
  let sql = `
     SELECT 
       i.item_id, i.title, i.description, i.price, i.condition_type, i.image_url, i.usage_months,
       u.name as seller_name, 
       c.name as category_name,
       COALESCE(AVG(r.rating), 0) as seller_rating,
       COUNT(r.review_id) as seller_review_count
     FROM Items i 
     JOIN Users u ON i.seller_id = u.user_id 
     JOIN Categories c ON i.category_id = c.category_id
     LEFT JOIN Reviews r ON r.reviewed_user_id = u.user_id
     WHERE i.status = 'available'
  `;
  
  const queryParams: any[] = [];
  if (searchQuery) {
    sql += ` AND (i.title LIKE ? OR i.description LIKE ?) `;
    queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }
  
  sql += ` GROUP BY i.item_id, u.name, c.name ORDER BY i.created_at DESC`;
  
  const [items] = await db.query(sql, queryParams) as any[];

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans">
      <TopNav userName={user.name} title="MarketPlace Browse" backLink="/dashboard" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />

        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 font-serif">
            Available Listings
          </h2>
          <form className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              name="q"
              defaultValue={searchQuery}
              placeholder="Search items..." 
              className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors backdrop-blur-md shadow-inner text-white" 
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-500 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
            <Tag className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl">No items available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {items.map((item: any) => (
              <ProductRevealCardWrapper key={item.item_id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
