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

      {/* Marquee HUD */}
      <div className="border-y border-white/10 bg-black/50 overflow-hidden py-1 z-10 relative whitespace-nowrap">
         <div className="text-pink-500/80 font-jetbrains text-xs tracking-widest inline-block animate-[marquee_20s_linear_infinite]">
           ● MONITORING LIVE · {alerts.length} ALERTS ACTIVE · SCANNING NETWORK · SECURE CONNECTION ESTABLISHED · ● MONITORING LIVE · {alerts.length} ALERTS ACTIVE · SCANNING NETWORK · SECURE CONNECTION ESTABLISHED · ● MONITORING LIVE · {alerts.length} ALERTS ACTIVE
         </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-8">
        
        {/* Left Command Center */}
        <div className="w-full">
          <div className="mb-10">
            <h2 className="text-5xl md:text-7xl font-playfair italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-2 flex items-center gap-4">
              <BellRing className="w-10 h-10 text-pink-500" /> Notify Me
            </h2>
          </div>
          
          <div className="w-full bg-black/40 border border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl magenta-pulse">
             <AlertForm categories={categories} />
          </div>
        </div>

        {/* Right Active Feeds */}
        <div className="w-full flex flex-col gap-4">
           <h3 className="text-sm font-jetbrains uppercase tracking-widest text-pink-500/50 mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" /> Active Telemetry Feeds
           </h3>
           
           {alerts.length === 0 ? (
             <p className="text-slate-500 font-jetbrains text-sm pl-4 border-l border-white/10">NO ACTIVE FEEDS. AWAITING INPUT.</p>
           ) : (
             <div className="flex flex-col gap-3">
               {alerts.map((alert: any, i: number) => (
                 <div 
                   key={alert.alert_id} 
                   className="group bg-black/60 border border-white/5 rounded-r-xl p-4 flex flex-col relative overflow-hidden animate-in slide-in-from-right-16 fade-in fill-mode-both"
                   style={{ animationDelay: `${i * 100}ms` }}
                 >
                    {/* Status strict border coding */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${alert.condition_type === 'new' ? 'bg-cyan-500' : alert.condition_type === 'used' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                    
                    <div className="flex items-center justify-between mb-2 pl-3 relative z-10">
                       <span className="font-bold font-jetbrains text-white uppercase tracking-wider">{alert.category_name}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded ${alert.condition_type === 'new' ? 'text-cyan-400' : alert.condition_type === 'used' ? 'text-amber-400' : 'text-slate-400'}`}>
                         [{alert.condition_type}]
                       </span>
                    </div>
                    <div className="text-xs text-slate-400 font-jetbrains flex items-center pl-3 relative z-10">
                       <span className="text-white/30 mr-2">BUDGET:</span> 
                       {alert.min_price > 0 ? `₹${alert.min_price}` : '₹0'} <span className="mx-2 text-pink-500/30">→</span> {alert.max_price < 9999999 ? `₹${alert.max_price}` : 'MAX'}
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
