"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export const AdminLayoutWrapper = ({ children, activePage, setActivePage }: { children: React.ReactNode, activePage: string, setActivePage: (p: string) => void }) => {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f4f6f8] font-sans text-slate-900">
      {/* Absolute Top Nav */}
      <header className="h-16 bg-[#212328] flex items-center justify-between px-6 z-20 shrink-0">
        <h1 className="text-white font-bold text-lg tracking-wide uppercase">Electronic Marketplace</h1>
        <div className="flex items-center gap-6">
           <span className="text-slate-300 text-sm font-medium">Admin</span>
           <button 
             onClick={handleLogout}
             className="bg-[#de4348] hover:bg-[#c93b3f] text-white text-sm font-medium px-4 py-2 rounded shadow transition-colors"
           >
             Logout
           </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <nav className="w-64 bg-[#32363e] flex-shrink-0 h-full overflow-y-auto hidden md:block border-r border-[#2a2d34]">
           <div className="flex flex-col py-6 space-y-1">
             <div className="px-6 mb-4 font-semibold text-white/50 text-xs tracking-widest uppercase">Admin Panel</div>
             <SidebarItem title="Dashboard" active={activePage === "Dashboard"} onClick={() => setActivePage("Dashboard")} />
             <SidebarItem title="User Management" active={activePage === "User Management"} onClick={() => setActivePage("User Management")} />
             <SidebarItem title="Item Management" active={activePage === "Item Management"} onClick={() => setActivePage("Item Management")} />
             <SidebarItem title="Category Management" active={activePage === "Category Management"} onClick={() => setActivePage("Category Management")} />
             <SidebarItem title="Reports Management" active={activePage === "Reports Management"} onClick={() => setActivePage("Reports Management")} />
             <SidebarItem title="Review Moderation" active={activePage === "Review Moderation"} onClick={() => setActivePage("Review Moderation")} />
             <SidebarItem title="Admin Logs" active={activePage === "Admin Logs"} onClick={() => setActivePage("Admin Logs")} />
           </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-white m-4 rounded-xl shadow-lg border border-slate-200/60 ring-1 ring-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ title, active, onClick }: { title: string, active: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-6 py-4 text-sm font-medium transition-colors ${active ? 'bg-[#3b4049] text-white border-l-4 border-slate-300' : 'text-slate-300 hover:bg-[#2b2f36] hover:text-white border-l-4 border-transparent'}`}
    >
       {title}
    </button>
  );
};
