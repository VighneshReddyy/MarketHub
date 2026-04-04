import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/ui/topnav";
import { ManageActions } from "./ManageActions";

export default async function ManagePage() {
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
  
  // Fetch user's active/removed listings
  const [listings] = await db.query(
    `SELECT i.item_id, i.title, i.price, i.description, i.image_url, i.usage_months, i.status, i.condition_type, c.name as category_name
     FROM Items i 
     LEFT JOIN Categories c ON i.category_id = c.category_id
     WHERE i.seller_id = ? AND i.status != 'sold'
     ORDER BY i.created_at DESC`,
    [user.user_id]
  ) as any[];

  // Fetch user's purchases / sold
  const [purchases] = await db.query(
    `SELECT o.*, i.title, i.price as orig_price 
     FROM Orders o 
     JOIN Items i ON o.item_id = i.item_id 
     WHERE o.buyer_id = ?
     ORDER BY o.order_id DESC`,
    [user.user_id]
  ) as any[];

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      <div className="absolute inset-0 bg-dot-matrix pointer-events-none z-0" />
      
      <TopNav userName={user.name} backLink="/dashboard" />

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:px-12 relative z-10 flex flex-col gap-16 py-12">
        
        {/* My Listings */}
        <section>
           <div className="flex items-baseline justify-between mb-6">
             <h2 className="text-3xl font-bold text-white">My Listings</h2>
             <span className="text-sm text-slate-500">
               {listings.filter((l: any) => l.status === 'available').length} active
             </span>
           </div>
           <hr className="border-teal-500/30 mb-8 border-t" />
           
           {listings.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black/30 rounded-2xl backdrop-blur-md">
               <p className="text-slate-500 text-sm">You have no active listings.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
               {listings.map((item: any) => (
                 <div key={item.item_id} className="group bg-black/40 border border-white/5 relative p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-white/5 transition-colors overflow-hidden rounded-xl">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${item.status === 'available' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                    
                    <div className="pl-4 flex-1">
                      <h3 className="font-semibold text-xl text-white mb-1 truncate max-w-xl">{item.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                         <span className={`capitalize ${item.status === 'available' ? 'text-teal-400' : 'text-amber-400'}`}>
                           {item.status}
                         </span>
                         <span>{item.category_name}</span>
                         <span className="capitalize">{item.condition_type}</span>
                      </div>
                    </div>

                    <div className="pl-4 md:pl-0 flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                       <span className="text-xl text-white font-bold">₹{parseFloat(item.price).toLocaleString()}</span>
                       {item.status === 'available' && (
                         <ManageActions item={item} />
                       )}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </section>


        {/* Purchase History */}
        <section>
           <div className="flex items-baseline justify-between mb-6">
             <h2 className="text-3xl font-bold text-white">Purchase History</h2>
             <span className="text-sm text-slate-500">
               {purchases.length} order{purchases.length !== 1 ? 's' : ''}
             </span>
           </div>
           <hr className="border-violet-500/30 mb-8 border-t" />
           
           {purchases.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black/30 rounded-2xl backdrop-blur-md">
               <p className="text-slate-500 text-sm">You haven&apos;t made any purchases yet.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
               {purchases.map((order: any) => (
                 <div key={order.order_id} className="bg-black/40 border border-white/5 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden rounded-xl">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-violet-500/40" />
                    
                    <div className="pl-4 flex items-center gap-6">
                       {/* Status indicator */}
                       <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                          <div className={`absolute inset-0 rounded-full border-2 ${order.status !== 'delivered' ? 'border-teal-400 animate-pulse' : 'border-green-500'}`} style={{ animationDuration: '3s' }} />
                          <div className={`w-6 h-6 rounded-full ${order.status !== 'delivered' ? 'bg-teal-400/20' : 'bg-green-500/20'}`} />
                       </div>
                       
                       <div>
                         <h3 className="font-semibold text-lg text-white mb-0.5 truncate max-w-md">{order.title}</h3>
                         <div className="text-xs text-slate-500">
                           Order #{order.order_id}
                         </div>
                       </div>
                    </div>
                    
                    <div className="pl-4 sm:pl-0 flex flex-col sm:items-end gap-2">
                       <span className="flex items-center justify-center text-xs font-medium tracking-wide px-3 py-1 bg-white/5 rounded-full border border-white/5 w-fit capitalize">
                          {order.status !== 'delivered' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-2 animate-slow-blink" />}
                          {order.status}
                       </span>
                       <span className="text-slate-300 font-semibold">₹{parseFloat(order.price).toLocaleString()}</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </section>

      </main>
    </div>
  );
}
