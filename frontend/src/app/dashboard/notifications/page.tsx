import { TopNav } from "@/components/ui/topnav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Bell, CheckCircle } from "lucide-react";
import { getDbConnection } from "@/lib/db";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  if (token) {
    try {
      user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {}
  }
  if (!user) redirect("/");

  const db = await getDbConnection();
  const [notifications] = await db.query(
    `SELECT notification_id, message, is_read FROM Notifications WHERE user_id = ? ORDER BY notification_id DESC`,
    [user.user_id]
  ) as any[];

  return (
    <div className="min-h-screen w-screen bg-mesh flex flex-col font-mono overflow-x-hidden overflow-y-auto relative text-white">
      <svg className="pointer-events-none fixed isolate z-50 opacity-[0.03] mix-blend-overlay inset-0 w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      
      <TopNav userName={user.name} />

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 relative z-10">
        <h1 className="font-serif italic text-5xl md:text-6xl text-white mb-10">
          Transmission Feed
        </h1>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border border-white/5 bg-black/40 backdrop-blur-xl rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <Bell className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No incoming transmissions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif: any) => (
              <div 
                key={notif.notification_id} 
                className={`p-6 border border-white/5 bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg flex items-start gap-4 transition-colors ${!notif.is_read ? 'border-l-4 border-l-cyan-500' : 'opacity-80'}`}
              >
                {!notif.is_read ? <Bell className="w-6 h-6 text-cyan-400 shrink-0" /> : <CheckCircle className="w-6 h-6 text-slate-600 shrink-0" />}
                <div>
                  <p className="text-white text-lg">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
