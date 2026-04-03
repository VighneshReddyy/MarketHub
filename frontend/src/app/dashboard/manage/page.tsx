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
    `SELECT i.*, c.name as category_name
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

  const activeCount = listings.filter((l: any) => l.status === 'available').length;
  const totalListedValue = listings.filter((l: any) => l.status === 'available').reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0);
  const pendingCount = purchases.filter((p: any) => p.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      {/* Portfolio Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-dot-matrix pointer-events-none z-0" />
      
      <TopNav userName={user.name} backLink="/dashboard" />

      {/* Sticky Top HUD Header */}
      <div className="sticky top-0 z-40 bg-[#060a14]/80 backdrop-blur-xl border-b border-white/5 py-3 w-full">
         <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center text-[11px] font-jetbrains tracking-widest uppercase text-slate-400">
            <span>PORTFOLIO TERMINAL <span className="text-white/20 mx-2">|</span> {user.name}</span>
            <span className="flex gap-4">
              <span className="text-teal-400">{activeCount} ACTIVE LST</span>
              <span className="text-white">₹{totalListedValue.toLocaleString()} VOL</span>
              <span className="text-violet-400">{pendingCount} PND DELV</span>
            </span>
         </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:px-12 relative z-10 flex flex-col gap-20 py-12">
        
        {/* Active Listings Sector */}
        <section>
           <h2 className="text-5xl font-bebas tracking-wider text-white mb-2 flex items-baseline justify-between">
              YOUR ACTIVE LISTINGS
              <span className="text-sm font-jetbrains text-teal-500 tracking-widest opacity-50">SECTOR / 01</span>
           </h2>
           <hr className="border-teal-500/50 mb-8 border-t-[2px] animate-line-draw transform scale-x-0 origin-left" />
           
           {listings.length === 0 ? (
             <p className="font-jetbrains text-sm text-slate-500 border-l border-white/10 pl-4 py-2 uppercase tracking-wide">
               Zero active assets on the network.
             </p>
           ) : (
             <div className="flex flex-col gap-4">
               {listings.map((item: any) => (
                 <div key={item.item_id} className="group bg-black/40 border border-white/5 relative p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:bg-white/5 transition-colors overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'available' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                    
                    <div className="pl-4 flex-1">
                      <h3 className="font-serif text-3xl font-semibold text-white mb-1 tracking-tight truncate max-w-xl">{item.title}</h3>
                      <div className="flex items-center gap-5 font-jetbrains text-xs uppercase tracking-widest text-slate-500">
                         <span className={item.status === 'available' ? 'text-teal-500/70' : 'text-amber-500/70'}>
                           [{item.status}]
                         </span>
                         <span>VOL: {item.category_name}</span>
                         <span>CND: {item.condition_type}</span>
                      </div>
                    </div>

                    <div className="pl-4 md:pl-0 flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                       <span className="font-jetbrains text-2xl text-white font-bold tracking-tight">₹{parseFloat(item.price).toLocaleString()}</span>
                       {item.status === 'available' && (
                         <ManageActions itemId={item.item_id} />
                       )}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </section>


        {/* Execution History */}
        <section>
           <h2 className="text-5xl font-bebas tracking-wider text-white mb-2 flex items-baseline justify-between mt-10">
              PURCHASE HISTORY
              <span className="text-sm font-jetbrains text-violet-500 tracking-widest opacity-50">SECTOR / 02</span>
           </h2>
           <hr className="border-violet-500/50 mb-8 border-t-[2px] animate-line-draw transform scale-x-0 origin-left" style={{ animationDelay: '200ms' }} />
           
           {purchases.length === 0 ? (
             <p className="font-jetbrains text-sm text-slate-500 border-l border-white/10 pl-4 py-2 uppercase tracking-wide">
               Zero external executions registered.
             </p>
           ) : (
             <div className="flex flex-col gap-4">
               {purchases.map((order: any) => (
                 <div key={order.order_id} className="bg-black/40 border border-white/5 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500/30" />
                    
                    <div className="pl-4 flex items-center gap-6">
                       {/* Animated pulsing ring avatar */}
                       <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                          <div className={`absolute inset-0 rounded-full border-2 ${order.status !== 'delivered' ? 'border-teal-400 animate-pulse' : 'border-green-500'}`} style={{ animationDuration: '3s' }} />
                          <div className={`w-8 h-8 rounded-full ${order.status !== 'delivered' ? 'bg-teal-400/20' : 'bg-green-500/20'}`} />
                       </div>
                       
                       <div>
                         <h3 className="font-serif text-2xl font-medium text-white mb-1 truncate max-w-md">{order.title}</h3>
                         <div className="font-jetbrains text-[10px] uppercase tracking-widest text-slate-500">
                           REC #{order.order_id} • VOL TRANSFER
                         </div>
                       </div>
                    </div>
                    
                    <div className="pl-4 sm:pl-0 flex flex-col sm:items-end gap-2">
                       <span className="font-jetbrains flex items-center justify-center text-xs tracking-widest px-3 py-1 bg-white/5 rounded-full uppercase border border-white/5 w-fit">
                          {order.status !== 'delivered' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-2 animate-slow-blink" />}
                          {order.status}
                       </span>
                       <span className="font-jetbrains text-lg text-slate-300">₹{parseFloat(order.price).toLocaleString()}</span>
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
