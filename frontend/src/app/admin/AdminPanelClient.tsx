"use client";

import React, { useState } from "react";
import {
  Menu, Home, Users, Package, Grid, Shield, Activity, Search, Ban, UserCheck, CheckCircle2, Star, Trash2, Edit, AlertCircle, X, ShieldAlert, Clock, MessageSquare, Plus, CheckCircle, TrendingUp, DollarSign, ShoppingCart, AlertTriangle, ArrowRight, XCircle, UserCircle, LogOut, Hexagon
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MOCK_REVENUE = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 }, { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 }, { name: 'Fri', value: 7000 }, { name: 'Sat', value: 6500 }, { name: 'Sun', value: 8000 }
];

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

  // Layout Colors - Vibrant Cyber/Glass Theme
  const colors = {
    bg: "bg-[#09090b]",
    sidebar: sidebarExpanded ? "w-64" : "w-16",
    sidebarBg: "bg-[#100e17] border-r border-indigo-500/10",
    sidebarHover: "hover:bg-indigo-500/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    card: "bg-[#12111a]/80 backdrop-blur-xl shadow-lg",
    border: "border-indigo-500/20",
    textPrm: "text-slate-100",
    textSec: "text-indigo-200/60"
  };

  const SIDEBAR_ITEMS = [
    { label: "Dashboard", icon: Home },
    { label: "User Management", icon: Users },
    { label: "Item Management", icon: Package },
    { label: "Category Management", icon: Grid },
    { label: "Reports Management", icon: AlertCircle },
    { label: "Review Moderation", icon: Shield },
    { label: "Admin Logs", icon: Activity },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden ${colors.bg} ${colors.textPrm} font-sans`}>
      {/* SIDEBAR */}
      <aside className={`flex flex-col shrink-0 transition-all duration-300 ease-in-out ${colors.sidebarBg} ${colors.sidebar} border-r ${colors.border}`}>
        <div className={`flex items-center h-16 px-4 border-b ${colors.border} ${!sidebarExpanded && 'justify-center'}`}>
          <div className="flex bg-indigo-500/20 p-2 rounded-lg shrink-0">
            <Hexagon className="w-5 h-5 text-indigo-400" />
          </div>
          {sidebarExpanded && <span className="ml-3 font-semibold text-sm tracking-widest uppercase text-slate-200">MarketHub Core</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto overflow-x-hidden">
          {SIDEBAR_ITEMS.map(item => {
            const isActive = activeTab === item.label;
            return (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 
                  ${isActive ? "bg-[#1e2130] text-indigo-400" : `text-slate-400 ${colors.sidebarHover} hover:text-slate-200`}
                  ${!sidebarExpanded && 'justify-center'}
                `}
                title={item.label}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-500" : ""}`} />
                {sidebarExpanded && (
                  <span className={`ml-3 text-sm font-medium whitespace-nowrap ${isActive ? "border-l-2 border-indigo-500 pl-2 -ml-[2px]" : ""}`}>
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className={`p-4 border-t ${colors.border} flex justify-center`}>
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className={`p-2 rounded-md ${colors.sidebarHover} text-slate-400`}>
            {sidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* TOP NAVBAR */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-6 border-b ${colors.border} bg-[#0f1117]/80 backdrop-blur-md z-10`}>
          <div className="flex items-center gap-2">
            <span className={colors.textSec}>Admin Panel</span>
            <span className={colors.textSec}>/</span>
            <span className="font-semibold text-slate-200">{activeTab}</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-xl border border-transparent transition-colors"
              onClick={() => setShowProfile(!showProfile)}
            >
              <UserCircle className="w-6 h-6 text-slate-200" />
              <div className="hidden sm:block text-sm text-left">
                <p className="font-semibold text-slate-200 leading-none">Admin</p>
                <p className="text-xs text-indigo-400 mt-1">Superuser</p>
              </div>
            </button>
            {showProfile && (
              <div className="absolute top-14 right-0 w-48 bg-[#12111a] border border-indigo-500/20 rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
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

          {/* === 1. DASHBOARD OVERVIEW === */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {/* Stat Cards */}
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden group`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                   <div className="flex justify-between items-start">
                     <div>
                       <p className={`text-sm ${colors.textSec} mb-1`}>Total Users</p>
                       <p className="text-3xl font-bold font-mono">{stats.totalUsers}</p>
                     </div>
                     <div className="p-2 bg-indigo-500/10 rounded-lg"><Users className="w-5 h-5 text-indigo-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                   <div className="flex justify-between items-start">
                     <div>
                       <p className={`text-sm ${colors.textSec} mb-1`}>Total Items</p>
                       <p className="text-3xl font-bold font-mono">{stats.totalItems}</p>
                     </div>
                     <div className="p-2 bg-emerald-500/10 rounded-lg"><Package className="w-5 h-5 text-emerald-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                   <div className="flex justify-between items-start">
                     <div>
                       <p className={`text-sm ${colors.textSec} mb-1`}>Pending Reports</p>
                       <p className="text-3xl font-bold font-mono">{stats.pendingReports}</p>
                     </div>
                     <div className="p-2 bg-rose-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-400" /></div>
                   </div>
                 </div>
                 <div className={`${colors.card} border ${colors.border} rounded-xl p-6 relative overflow-hidden`}>
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                   <div className="flex justify-between items-start">
                     <div>
                       <p className={`text-sm ${colors.textSec} mb-1`}>Total Orders</p>
                       <p className="text-3xl font-bold font-mono">{stats.totalOrders}</p>
                     </div>
                     <div className="p-2 bg-amber-500/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-amber-400" /></div>
                   </div>
                 </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                   <h3 className="text-lg font-semibold mb-6">Revenue Overview (7 Days - Mock)</h3>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={MOCK_REVENUE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                         <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                         <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                         <RechartsTooltip contentStyle={{ backgroundColor: '#13151e', borderColor: '#2a2d3e', color: '#fff' }} itemStyle={{ color: '#6366f1' }} />
                         <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                       </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
                <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                   <h3 className="text-lg font-semibold mb-6">Items by Category (Live from DB)</h3>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={categoryDistribution} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" horizontal={false} />
                         <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                         <YAxis type="category" dataKey="name" stroke="#64748b" tick={{fill: '#e2e8f0', fontSize: 12}} axisLine={false} tickLine={false} />
                         <RechartsTooltip cursor={{fill: '#1e2130'}} contentStyle={{ backgroundColor: '#13151e', borderColor: '#2a2d3e', color: '#fff' }} />
                         <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              </div>

              {/* Feed */}
              <div className={`${colors.card} border ${colors.border} rounded-xl p-6`}>
                <h3 className="text-lg font-semibold mb-6">Recent Activity (Live DB)</h3>
                <div className="space-y-6">
                  {adminLogs.slice(0, 5).map((log: any) => (
                    <div key={log.log_id} className="flex gap-4 items-center">
                      <div className={`w-2 h-2 rounded-full shrink-0 bg-indigo-500`} />
                      <div className="flex-1">
                        <p className="text-sm"><span className="font-semibold text-slate-200">Admin</span> <span className={colors.textSec}>{log.action}</span></p>
                      </div>
                      <span className={`text-xs ${colors.textSec} font-mono`}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === 2. USER MANAGEMENT === */}
          {activeTab === "User Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex bg-[#13151e] items-center border border-[#2a2d3e] rounded-xl px-4 py-2 focus-within:border-indigo-500 transition-colors">
                 <Search className={`w-5 h-5 ${colors.textSec}`} />
                 <input type="text" placeholder="Search by name, email, or ID..." className="bg-transparent border-none outline-none text-sm text-slate-200 ml-3 flex-1 h-8 placeholder:text-slate-500" />
                 <button className="text-slate-500 hover:text-slate-300"><XCircle className="w-4 h-4" /></button>
               </div>

               <div className="rounded-xl border border-[#2a2d3e] overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-[#13151e] border-b border-[#2a2d3e] text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      <tr>
                        <th className="p-4 w-12 text-center"><input type="checkbox" className="accent-indigo-500" /></th>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2d3e]">
                      {users.map((u: any, i: number) => (
                        <tr key={u.user_id} className={`${i % 2 === 0 ? 'bg-[#1a1d2e]' : 'bg-[#161827]'} hover:bg-[#1e2130] transition-colors`}>
                           <td className="p-4 text-center"><input type="checkbox" className="accent-indigo-500" /></td>
                           <td className="p-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shadow-inner border border-white/5">{u.name.substring(0,2).toUpperCase()}</div>
                               <div>
                                 <p className="font-semibold">{u.name}</p>
                                 <p className={`text-xs ${colors.textSec} font-mono mt-0.5`}>{u.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="p-4">
                             <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${u.is_admin ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'}`}>
                               {u.is_admin ? 'Admin' : 'User'}
                             </span>
                           </td>
                           <td className="p-4">
                             <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full bg-emerald-500`} />
                               <span className="text-sm font-medium">Active</span>
                             </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* === 3. ITEM MANAGEMENT === */}
          {activeTab === "Item Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {items.map((item: any) => (
                   <div key={item.item_id} className={`${colors.card} border ${colors.border} rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors group`}>
                     <div className="h-40 bg-[#13151e] relative flex items-center justify-center group-hover:bg-[#1a1d2e] transition-colors border-b border-[#2a2d3e]">
                        <Package className="w-12 h-12 text-slate-700 group-hover:text-slate-600 transition-colors" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          {item.status !== 'available' && <span className="bg-amber-500 text-black text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-md">{item.status}</span>}
                        </div>
                     </div>
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="font-semibold text-lg line-clamp-1" title={item.title}>{item.title}</h3>
                         <span className="font-mono text-emerald-400 font-bold">₹{item.price}</span>
                       </div>
                       <p className={`text-xs ${colors.textSec} mb-4 font-mono uppercase tracking-wider block`}>ID: {item.item_id} • Seller ID: {item.seller_id}</p>
                       
                       <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2d3e]">
                         <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs font-medium">{item.category_name || 'Category'}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* === 4. CATEGORY MANAGEMENT === */}
          {activeTab === "Category Management" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
                <div className="space-y-3">
                  {categories.map((cat: any) => (
                    <div key={cat.category_id} className={`${colors.card} border ${colors.border} p-4 rounded-xl flex items-center justify-between hover:border-indigo-500/30 transition-colors cursor-pointer`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#13151e] flex items-center justify-center text-xl shadow-inner border border-[#2a2d3e]">📦</div>
                        <h4 className="font-medium text-slate-200">{cat.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === 5. REPORTS MANAGEMENT === */}
          {activeTab === "Reports Management" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-4">
                 {reports.map((report: any) => (
                   <div key={report.report_id} className={`${colors.card} border ${colors.border} rounded-xl p-5 hover:bg-[#1e2130] transition-colors`}>
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                           <ShieldAlert className={`w-5 h-5 text-amber-500`} />
                           <h4 className="font-semibold text-slate-200">Report #{report.report_id} • {report.status}</h4>
                         </div>
                      </div>
                      <div className="p-4 bg-[#13151e] rounded-lg border border-[#2a2d3e] mb-4">
                        <p className="text-sm font-medium mb-1"><span className="text-slate-500">Target Type Item ID:</span> {report.item_id || 'User'}</p>
                        <p className="text-sm text-slate-300 italic">"{report.reason}"</p>
                      </div>
                   </div>
                 ))}
                 {reports.length === 0 && <p className="text-slate-500">No reports found in the database.</p>}
               </div>
            </div>
          )}

          {/* === 6. REVIEW MODERATION === */}
          {activeTab === "Review Moderation" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-y-6">
                {reviews.map((rev: any) => {
                  const isFlagged = rev.rating === 1 || rev.comment.toUpperCase() === rev.comment && rev.comment.length > 10;
                  return (
                  <div key={rev.review_id} className={`${colors.card} border ${isFlagged ? 'border-amber-500/50' : colors.border} rounded-xl p-6 relative`}>
                    {isFlagged && <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">FLAGGED</div>}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs ring-2 ring-slate-700/50">{rev.reviewer_name?.charAt(0) || 'U'}</div>
                        <div>
                          <p className="font-semibold text-sm">{rev.reviewer_name || 'Unknown User'} <span className="text-slate-500 font-normal ml-1">reviewed {rev.reviewed_name || 'Seller'}</span></p>
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-800'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#13151e] p-4 rounded-lg border border-[#2a2d3e]">
                      <p className={`text-sm ${rev.rating === 1 ? 'text-rose-200' : 'text-slate-200'} leading-relaxed`}>"{rev.comment}"</p>
                    </div>
                  </div>
                )})}
                {reviews.length === 0 && <p className="text-slate-500">No reviews found in the database.</p>}
              </div>
            </div>
          )}

          {/* === 7. ADMIN LOGS === */}
          {activeTab === "Admin Logs" && (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
               <div className="relative border-l-2 border-[#2a2d3e] ml-6 space-y-12">
                 {adminLogs.map((log: any) => (
                   <div key={log.log_id} className="relative pl-8 group">
                     {/* Marker */}
                     <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-[#0f1117] transition-transform group-hover:scale-125`} />
                     
                     <div className={`${colors.card} border ${colors.border} p-5 rounded-xl block hover:-translate-y-1 transition-transform group-hover:shadow-lg shadow-black/50`}>
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                           <Activity className="w-4 h-4 text-slate-500" /> {log.action}
                         </h4>
                         <span className="text-xs font-mono text-slate-400">{log.time || new Date(log.created_at).toLocaleString()}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
