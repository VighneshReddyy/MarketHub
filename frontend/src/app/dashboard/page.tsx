import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/ui/topnav";
import { ClientDashboardGrid } from "./ClientDashboard";
import { TextEffect } from "@/components/ui/text-effect";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  try {
    if (token) {
      user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    }
  } catch (e) {
    user = null;
  }
  
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-screen bg-mesh flex flex-col font-mono overflow-x-hidden overflow-y-auto relative text-white">
      {/* Editorial Noise Grain Overlay */}
      <svg className="pointer-events-none fixed isolate z-50 opacity-[0.03] mix-blend-overlay inset-0 w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      
      {/* Radial Bloom Behind Headline */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <TopNav userName={user.name} />

      {/* Full screen layout */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden gap-8 md:gap-10 py-6">
        
        {/* Background Gradients - Rich & Vibrant */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/30 blur-[180px] animate-pulse duration-[10000ms]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] rounded-full bg-cyan-600/30 blur-[180px] animate-pulse duration-[12000ms]" />
          <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[200px]" />
        </div>
        
        {/* Stunning Enormous Headline */}
        <div className="z-10 flex flex-col text-center items-center justify-center w-full max-w-5xl mx-auto px-4 mt-8">
          <TextEffect 
            per='char' 
            as='h1'
            preset='blur'
            className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter text-white drop-shadow-2xl whitespace-nowrap"
          >
            {`Welcome back, ${user.name}.`}
          </TextEffect>
          <TextEffect 
            per='word' 
            preset='fade' 
            delay={1.0}
            as='p'
            className="mt-6 font-sans antialiased text-lg md:text-2xl font-medium text-slate-300 tracking-wide"
          >
            What are we doing today?
          </TextEffect>
        </div>

        {/* Buttons Grid constrained */}
        <div className="w-full max-w-4xl z-10 px-6">
           <ClientDashboardGrid />
        </div>
      </main>
    </div>
  );
}
