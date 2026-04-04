import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/ui/topnav";
import { AlertForm } from "./AlertForm";
import { BellRing } from "lucide-react";

export default async function AlertsPage() {
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
  const [categories] = await db.query(`SELECT category_id, name FROM Categories ORDER BY name ASC`) as any[];

  // Fetch user's existing alerts
  const [alerts] = await db.query(
    `SELECT a.*, c.name as category_name 
     FROM Alerts a 
     JOIN Categories c ON a.category_id = c.category_id 
     WHERE a.user_id = ?
     ORDER BY a.alert_id DESC`,
    [user.user_id]
  ) as any[];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      <div className="absolute inset-0 bg-diagonal-lines pointer-events-none z-0" />
      <TopNav userName={user.name} backLink="/dashboard" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-8">
        
        {/* Left: Form */}
        <div className="w-full">
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-500 mb-3 flex items-center gap-4">
              <BellRing className="w-9 h-9 text-pink-400" /> Price Alerts
            </h2>
            <p className="text-slate-400 text-sm">Get notified when a matching item is listed within your budget.</p>
          </div>
          
          <div className="w-full bg-black/40 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-xl">
             <AlertForm categories={categories} />
          </div>
        </div>

        {/* Right: Active Alerts */}
        <div className="w-full flex flex-col gap-4">
           <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
             Active Alerts
             <span className="ml-auto text-pink-400 font-mono text-xs">{alerts.length} total</span>
           </h3>
           
           {alerts.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black/30 backdrop-blur-md rounded-2xl">
               <BellRing className="w-10 h-10 text-slate-600 mb-3" />
               <p className="text-slate-500 text-sm">No active alerts. Set one up to get started.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-3">
               {alerts.map((alert: any, i: number) => (
                 <div 
                   key={alert.alert_id} 
                   className="group bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden animate-in slide-in-from-right-16 fade-in fill-mode-both"
                   style={{ animationDelay: `${i * 100}ms` }}
                 >
                    {/* Condition color indicator */}
                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${alert.condition_type === 'new' ? 'bg-cyan-500' : alert.condition_type === 'used' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                    
                    <div className="flex items-center justify-between mb-2 pl-3 relative z-10">
                       <span className="font-semibold text-white">{alert.category_name}</span>
                       <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-white/5 rounded ${alert.condition_type === 'new' ? 'text-cyan-400' : alert.condition_type === 'used' ? 'text-amber-400' : 'text-slate-400'}`}>
                         {alert.condition_type === 'any' ? 'Any condition' : alert.condition_type}
                       </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center pl-3 relative z-10">
                       <span className="text-white/30 mr-2">Budget:</span> 
                       {alert.min_price > 0 ? `₹${alert.min_price}` : '₹0'} <span className="mx-2 text-pink-500/40">–</span> {alert.max_price < 9999999 ? `₹${alert.max_price}` : 'No max'}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
