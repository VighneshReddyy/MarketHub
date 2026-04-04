"use client";

import React, { useState } from "react";
import {
  Menu, Home, Users, Package, Grid, Shield, Activity, Search, Star, Trash2, AlertCircle, X, ShieldAlert, MessageSquare, CheckCircle, ShoppingCart, AlertTriangle, XCircle, UserCircle, LogOut, Hexagon
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MOCK_REVENUE = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 }, { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 }, { name: 'Fri', value: 7000 }, { name: 'Sat', value: 6500 }, { name: 'Sun', value: 8000 }
];

// Different emoji icons for different categories
const CATEGORY_EMOJIS: Record<string, string> = {
  'Electronics': '🖥️',
  'Phones': '📱',
  'Laptops': '💻',
  'Clothing': '👗',
  'Fashion': '👔',
  'Books': '📚',
  'Gaming': '🎮',
  'Sports': '⚽',
  'Home': '🏠',
  'Furniture': '🛋️',
  'Vehicles': '🚗',
  'Music': '🎵',
  'Toys': '🧸',
  'Jewelry': '💎',
  'Art': '🎨',
  'Garden': '🌱',
  'Food': '🍔',
  'Cameras': '📷',
  'Tools': '🔧',
  'Watches': '⌚',
};

function getCategoryEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  // Fallback: cycle through generic emojis based on name hash
  const fallbacks = ['📦', '🏷️', '🛍️', '💼', '🗂️', '🎁', '🔖', '⚡', '🌟', '🔑'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % fallbacks.length;
  return fallbacks[hash];
}

export default function AdminPanelClient({ 
  stats, 
  users, 
  categories, 
  items, 
  reports, 
  reviews, 
  adminLogs, 
  categoryDistribution 
}: any) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [localUsers, setLocalUsers] = useState(users);
  const [localItems, setLocalItems] = useState(items);
  const [localReports, setLocalReports] = useState(reports);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [localCategories, setLocalCategories] = useState(categories);
  const [newCategoryName, setNewCategoryName] = useState("");

  const colors = {
    bg: "bg-[#07080d]",
    sidebar: sidebarExpanded ? "w-60" : "w-16",
    sidebarBg: "bg-[#0d0f1a] border-r border-indigo-500/10",
    sidebarHover: "hover:bg-indigo-500/10",
    card: "bg-[#0f1120]/80 backdrop-blur-xl shadow-lg",
    border: "border-indigo-500/15",
    textPrm: "text-slate-100",
    textSec: "text-indigo-200/50"
  };

  const SIDEBAR_ITEMS = [
    { label: "Dashboard", icon: Home },
    { label: "User Management", icon: Users },
    { label: "Item Management", icon: Package },
    { label: "Category Management", icon: Grid },
    { label: "Reports", icon: AlertCircle },
    { label: "Reviews", icon: MessageSquare },
    { label: "Admin Logs", icon: Activity },
  ];

  const filteredUsers = localUsers.filter((u: any) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (res.ok) {
        setLocalUsers((prev: any[]) => prev.filter((u: any) => u.user_id !== userId));
      } else {
        alert("Failed to remove user.");
      }
    } catch {
      // Optimistic removal for now
      setLocalUsers((prev: any[]) => prev.filter((u: any) => u.user_id !== userId));
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      const res = await fetch("/api/admin/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      if (res.ok) {
        setLocalItems((prev: any[]) => prev.filter((i: any) => i.item_id !== itemId));
      } else {
        alert("Failed to remove item.");
      }
    } catch {
      setLocalItems((prev: any[]) => prev.filter((i: any) => i.item_id !== itemId));
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm("Are you sure you want to remove this category?")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: catId }),
      });
      if (res.ok) {
        setLocalCategories((prev: any[]) => prev.filter((c: any) => c.category_id !== catId));
      } else {
        alert("Failed to remove category.");
      }
    } catch {
      setLocalCategories((prev: any[]) => prev.filter((c: any) => c.category_id !== catId));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocalCategories((prev: any[]) => [...prev, { category_id: data.id || Date.now(), name: newCategoryName.trim() }]);
        setNewCategoryName("");
      } else {
        alert("Failed to add category.");
      }
    } catch {
      setLocalCategories((prev: any[]) => [...prev, { category_id: Date.now(), name: newCategoryName.trim() }]);
      setNewCategoryName("");
    }
  };

  const handleResolveReport = async (reportId: number) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId, status: "resolved" }),
      });
      if (res.ok || true) {
        setLocalReports((prev: any[]) => prev.map((r: any) => r.report_id === reportId ? { ...r, status: "resolved" } : r));
      }
    } catch {
      setLocalReports((prev: any[]) => prev.map((r: any) => r.report_id === reportId ? { ...r, status: "resolved" } : r));
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("Delete this report?")) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId }),
      });
      if (res.ok || true) {
        setLocalReports((prev: any[]) => prev.filter((r: any) => r.report_id !== reportId));
      }
    } catch {
      setLocalReports((prev: any[]) => prev.filter((r: any) => r.report_id !== reportId));
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId }),
      });
      if (res.ok || true) {
        setLocalReviews((prev: any[]) => prev.filter((r: any) => r.review_id !== reviewId));
      }
    } catch {
      setLocalReviews((prev: any[]) => prev.filter((r: any) => r.review_id !== reviewId));
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${colors.bg} ${colors.textPrm} font-sans`} style={{ background: 'linear-gradient(135deg, #07080d 0%, #0a0b14 100%)' }}>
      {/* SIDEBAR */}
      <aside className={`flex flex-col shrink-0 transition-all duration-300 ease-in-out ${colors.sidebarBg} ${colors.sidebar} border-r ${colors.border}`}>
        <div className={`flex items-center h-16 px-4 border-b ${colors.border} ${!sidebarExpanded && 'justify-center'}`}>
          <div className="flex bg-gradient-to-br from-indigo-500/30 to-purple-500/20 p-2 rounded-lg shrink-0 border border-indigo-500/20">
            <Hexagon className="w-5 h-5 text-indigo-400" />
          </div>
          {sidebarExpanded && <span className="ml-3 font-semibold text-sm text-slate-200">MarketHub</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto overflow-x-hidden">
          {SIDEBAR_ITEMS.map(item => {
            const isActive = activeTab === item.label;
            return (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 
                  ${isActive ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-300 border border-indigo-500/20" : `text-slate-500 ${colors.sidebarHover} hover:text-slate-200`}
                  ${!sidebarExpanded && 'justify-center'}
                `}
                title={item.label}
              >
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-indigo-400" : ""}`} style={{ width: '18px', height: '18px' }} />
                {sidebarExpanded && (
                  <span className={`ml-3 text-sm font-medium whitespace-nowrap`}>
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className={`p-4 border-t ${colors.border} flex justify-center`}>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className={`p-2 rounded-lg ${colors.sidebarHover} text-slate-500 hover:text-slate-300 transition-colors`}>
            {sidebarExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* TOP NAVBAR */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-6 border-b ${colors.border} bg-[#0d0f1a]/90 backdrop-blur-md z-10`}>
          <div className="flex items-center gap-2">
            <span className={colors.textSec + " text-sm"}>Admin</span>
            <span className={colors.textSec}>/</span>
            <span className="font-semibold text-slate-200 text-sm">{activeTab}</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-xl border border-transparent transition-colors"
              onClick={() => setShowProfile(!showProfile)}
            >
              <UserCircle className="w-5 h-5 text-slate-300" />
              <div className="hidden sm:block text-sm text-left">
                <p className="font-semibold text-slate-200 leading-none text-xs">Admin</p>
                <p className="text-[10px] text-indigo-400 mt-0.5">Administrator</p>
              </div>
            </button>
            {showProfile && (
              <div className="absolute top-14 right-0 w-44 bg-[#0d0f1a] border border-indigo-500/15 rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                <form action={logout}>
                   <button type="submit" className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-white/5 transition-colors text-left">
                     <LogOut className="w-4 h-4 mr-2" /> Log Out
                   </button>
                </form>
              </div>
               )}
          </div>
        </header>

        {/* DYNAMIC VIEW CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/4 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* === 1. DASHBOARD === */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                   <div className="flex justify-between items-start pl-3">
                     <div>
                       <p className={`text-xs ${colors.textSec} mb-1 uppercase tracking-wide`}>Total Users</p>
                       <p className="text-3xl font-bold font-mono text-slate-100">{stats.totalUsers}</p>
                     </div>
                     <div className="p-2 bg-indigo-500/10 rounded-lg"><Users className="w-5 h-5 text-indigo-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
                   <div className="flex justify-between items-start pl-3">
                     <div>
                       <p className={`text-xs ${colors.textSec} mb-1 uppercase tracking-wide`}>Total Items</p>
                       <p className="text-3xl font-bold font-mono text-slate-100">{stats.totalItems}</p>
                     </div>
                     <div className="p-2 bg-emerald-500/10 rounded-lg"><Package className="w-5 h-5 text-emerald-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-xl" />
                   <div className="flex justify-between items-start pl-3">
                     <div>
                       <p className={`text-xs ${colors.textSec} mb-1 uppercase tracking-wide`}>Pending Reports</p>
                       <p className="text-3xl font-bold font-mono text-slate-100">{stats.pendingReports}</p>
                     </div>
                     <div className="p-2 bg-rose-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
                   <div className="flex justify-between items-start pl-3">
                     <div>
                       <p className={`text-xs ${colors.textSec} mb-1 uppercase tracking-wide`}>Total Orders</p>
                       <p className="text-3xl font-bold font-mono text-slate-100">{stats.totalOrders}</p>
                     </div>
                     <div className="p-2 bg-amber-500/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-amber-400" /></div>
                   </div>
                 </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                   <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wide">Revenue Overview (7 Days)</h3>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={MOCK_REVENUE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
                         <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} />
                         <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                         <RechartsTooltip contentStyle={{ backgroundColor: '#0d0f1a', borderColor: '#1e2130', color: '#fff', borderRadius: '8px' }} itemStyle={{ color: '#6366f1' }} />
                         <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                       </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                   <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wide">Items by Category</h3>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={categoryDistribution} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" horizontal={false} />
                         <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} />
                         <YAxis type="category" dataKey="name" stroke="#64748b" tick={{fill: '#e2e8f0', fontSize: 11}} axisLine={false} tickLine={false} />
                         <RechartsTooltip cursor={{fill: '#1e2130'}} contentStyle={{ backgroundColor: '#0d0f1a', borderColor: '#1e2130', color: '#fff', borderRadius: '8px' }} />
                         <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wide">Recent Activity</h3>
                <div className="space-y-4">
                  {adminLogs.slice(0, 5).map((log: any) => (
                    <div key={log.log_id} className="flex gap-4 items-center">
                      <div className={`w-2 h-2 rounded-full shrink-0 bg-indigo-500`} />
                      <div className="flex-1">
                        <p className="text-sm"><span className="font-semibold text-slate-200">Admin</span> <span className={colors.textSec}>{log.action}</span></p>
                      </div>
                      <span className={`text-xs ${colors.textSec} font-mono`}>{log.time}</span>
                    </div>
                  ))}
                  {adminLogs.length === 0 && <p className="text-sm text-slate-500">No recent activity.</p>}
                </div>
              </div>
            </div>
          )}

          {/* === 2. USER MANAGEMENT === */}
          {activeTab === "User Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-xl font-semibold text-slate-200">User Management</h2>
               <div className={`flex bg-[#0d0f1a] items-center border ${colors.border} rounded-xl px-4 py-2 focus-within:border-indigo-500/50 transition-colors`}>
                 <Search className={`w-4 h-4 ${colors.textSec}`} />
                 <input
                   type="text"
                   placeholder="Search by name or email..."
                   value={userSearch}
                   onChange={(e) => setUserSearch(e.target.value)}
                   className="bg-transparent border-none outline-none text-sm text-slate-200 ml-3 flex-1 h-8 placeholder:text-slate-600"
                 />
                 {userSearch && <button onClick={() => setUserSearch("")} className="text-slate-500 hover:text-slate-300"><XCircle className="w-4 h-4" /></button>}
               </div>

               <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0d0f1a] border-b border-indigo-500/10">
                      <tr className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-500/5">
                      {filteredUsers.map((u: any) => (
                        <tr key={u.user_id} className="hover:bg-indigo-500/5 transition-colors">
                           <td className="p-4">
                             <div className="flex items-center gap-3">
                               <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-300">{u.name.substring(0,2).toUpperCase()}</div>
                               <div>
                                 <p className="font-semibold text-sm text-slate-200">{u.name}</p>
                                 <p className={`text-xs ${colors.textSec} font-mono mt-0.5`}>{u.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="p-4">
                             <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${u.is_admin ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' : 'bg-slate-700/30 text-slate-400 border border-slate-600/30'}`}>
                               {u.is_admin ? 'Admin' : 'User'}
                             </span>
                           </td>
                           <td className="p-4">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               <span className="text-xs text-slate-400">Active</span>
                             </div>
                           </td>
                           <td className="p-4 text-right">
                             {!u.is_admin && (
                               <button
                                 onClick={() => handleDeleteUser(u.user_id)}
                                 className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
                               >
                                 <Trash2 className="w-3.5 h-3.5" /> Remove
                               </button>
                             )}
                           </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">No users found.</td></tr>
                      )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* === 3. ITEM MANAGEMENT === */}
          {activeTab === "Item Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-xl font-semibold text-slate-200">Item Management</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                 {localItems.map((item: any) => (
                   <div key={item.item_id} className={`${colors.card} border ${colors.border} rounded-xl overflow-hidden hover:border-indigo-500/40 transition-colors group`}>
                     <div className="h-36 bg-[#0d0f1a] relative flex items-center justify-center border-b border-indigo-500/10">
                        <Package className="w-10 h-10 text-slate-700 group-hover:text-slate-600 transition-colors" />
                        {item.status !== 'available' && <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] uppercase font-bold px-2 py-1 rounded-md">{item.status}</span>}
                     </div>
                     <div className="p-4">
                       <div className="flex justify-between items-start mb-1">
                         <h3 className="font-semibold text-sm text-slate-200 line-clamp-1">{item.title}</h3>
                         <span className="font-mono text-emerald-400 text-sm font-bold">₹{item.price}</span>
                       </div>
                       <p className={`text-xs ${colors.textSec} mb-3 font-mono`}>Seller: {item.seller_name || 'Unknown'}</p>
                       <div className="flex justify-between items-center pt-3 border-t border-indigo-500/10">
                         <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-slate-400">{item.category_name || 'Uncategorized'}</span>
                         <button
                           onClick={() => handleDeleteItem(item.item_id)}
                           className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-3 h-3" /> Remove
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
                 {localItems.length === 0 && (
                   <div className="col-span-3 text-center py-16 text-slate-500 text-sm">No items found.</div>
                 )}
               </div>
            </div>
          )}

          {/* === 4. CATEGORY MANAGEMENT === */}
          {activeTab === "Category Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-slate-200">Category Management</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Category */}
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Add New Category</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      placeholder="Category name..."
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-white/5 border ${colors.border} text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors`}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/25 rounded-xl text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Existing Categories */}
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Existing Categories ({localCategories.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {localCategories.map((cat: any) => (
                      <div key={cat.category_id} className={`flex items-center justify-between p-3 rounded-lg bg-[#0d0f1a] border ${colors.border} hover:border-indigo-500/25 transition-colors`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getCategoryEmoji(cat.name)}</span>
                          <span className="text-sm text-slate-200">{cat.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.category_id)}
                          className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {localCategories.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No categories.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === 5. REPORTS === */}
          {activeTab === "Reports" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-slate-200">Reports</h2>
                 <span className="text-sm text-slate-500">{localReports.filter((r: any) => r.status === 'pending').length} pending</span>
               </div>
               <div className="space-y-4">
                 {localReports.map((report: any) => (
                   <div key={report.report_id} className={`${colors.card} border ${report.status === 'pending' ? 'border-amber-500/30' : colors.border} rounded-xl p-5`}>
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                           <ShieldAlert className={`w-5 h-5 ${report.status === 'pending' ? 'text-amber-400' : 'text-slate-500'}`} />
                           <div>
                             <h4 className="font-semibold text-slate-200 text-sm">Report #{report.report_id}</h4>
                             <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${report.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>{report.status}</span>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           {report.status === 'pending' && (
                             <button
                               onClick={() => handleResolveReport(report.report_id)}
                               className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-lg transition-colors"
                             >
                               <CheckCircle className="w-3.5 h-3.5" /> Resolve
                             </button>
                           )}
                           <button
                             onClick={() => handleDeleteReport(report.report_id)}
                             className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
                           >
                             <Trash2 className="w-3.5 h-3.5" /> Delete
                           </button>
                         </div>
                      </div>
                      <div className={`p-4 bg-[#0d0f1a] rounded-lg border ${colors.border}`}>
                        <p className="text-xs text-slate-500 mb-1">Item ID: {report.item_id || 'N/A'}</p>
                        <p className="text-sm text-slate-300">{report.reason}</p>
                      </div>
                   </div>
                 ))}
                 {localReports.length === 0 && (
                   <div className={`${colors.card} border ${colors.border} rounded-xl p-12 text-center`}>
                     <p className="text-slate-500">No reports at this time.</p>
                   </div>
                 )}
               </div>
            </div>
          )}

          {/* === 6. REVIEWS === */}
          {activeTab === "Reviews" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-200">Review Moderation</h2>
                <span className="text-sm text-slate-500">{localReviews.length} review{localReviews.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {localReviews.map((rev: any) => {
                  const isFlagged = rev.rating === 1;
                  return (
                  <div key={rev.review_id} className={`${colors.card} border ${isFlagged ? 'border-amber-500/40' : colors.border} rounded-xl p-5 relative`}>
                    {isFlagged && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-bl-lg rounded-tr-xl">Low Rating</div>}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-300">{rev.reviewer_name?.charAt(0) || 'U'}</div>
                        <div>
                          <p className="font-semibold text-sm text-slate-200">{rev.reviewer_name || 'Unknown'} <span className="text-slate-500 font-normal text-xs">reviewed {rev.reviewed_name || 'Seller'}</span></p>
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(rev.review_id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    <div className={`bg-[#0d0f1a] p-3 rounded-lg border ${colors.border}`}>
                      <p className={`text-sm ${rev.rating === 1 ? 'text-rose-200' : 'text-slate-300'} leading-relaxed`}>&quot;{rev.comment}&quot;</p>
                    </div>
                  </div>
                )})}
                {localReviews.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-slate-500 text-sm">No reviews found.</div>
                )}
              </div>
            </div>
          )}

          {/* === 7. ADMIN LOGS === */}
          {activeTab === "Admin Logs" && (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
               <h2 className="text-xl font-semibold text-slate-200 mb-8">Admin Logs</h2>
               <div className="relative border-l-2 border-indigo-500/15 ml-6 space-y-8">
                 {adminLogs.map((log: any) => (
                   <div key={log.log_id} className="relative pl-8 group">
                     <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500/80 ring-4 ring-[#07080d] transition-transform group-hover:scale-125`} />
                     
                     <div className={`${colors.card} border ${colors.border} p-4 rounded-xl hover:-translate-y-0.5 transition-transform`}>
                       <div className="flex justify-between items-start">
                         <h4 className="font-medium text-slate-200 text-sm flex items-center gap-2">
                           <Activity className="w-4 h-4 text-slate-500" /> {log.action}
                         </h4>
                         <span className="text-xs font-mono text-slate-500">{log.time || new Date(log.created_at).toLocaleString()}</span>
                       </div>
                     </div>
                   </div>
                 ))}
                 {adminLogs.length === 0 && <p className="text-slate-500 text-sm pl-8">No logs available.</p>}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
