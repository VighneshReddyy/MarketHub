import { TopNav } from "@/components/ui/topnav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { getDbConnection } from "@/lib/db";

export default async function RatingsPage() {
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
  const [reviews] = await db.query(`
    SELECT r.review_id, r.rating, r.comment, u.name as reviewer_name
    FROM Reviews r
    LEFT JOIN Users u ON r.reviewer_id = u.user_id
    WHERE r.reviewed_user_id = ?
    ORDER BY r.review_id DESC
  `, [user.user_id]) as any[];

  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen w-screen bg-mesh flex flex-col font-mono overflow-x-hidden overflow-y-auto relative text-white">
      <svg className="pointer-events-none fixed isolate z-50 opacity-[0.03] mix-blend-overlay inset-0 w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      
      <TopNav userName={user.name} backLink="/dashboard" />

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 relative z-10">
        <h1 className="font-serif italic text-4xl md:text-5xl text-white mb-10">
          My Reviews
        </h1>

        <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-black/40 backdrop-blur-xl rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] border-t-amber-500/20 mb-10">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-8 h-8 ${i <= Math.round(avgRating) ? 'text-amber-500 fill-amber-500' : 'text-slate-700 fill-slate-700'}`} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0 Average Rating` : 'No rating yet'}</h2>
          <p className="text-slate-400">{reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''} on your profile` : 'No reviews yet'}</p>
        </div>

        <div className="space-y-4">
          {reviews.map((rev: any) => (
            <div key={rev.review_id} className="p-6 bg-black/50 border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex justify-center items-center font-bold text-slate-300">
                    {rev.reviewer_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white leading-none">{rev.reviewer_name}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                     <Star key={star} className={`w-4 h-4 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-800'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300">&quot;{rev.comment}&quot;</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
