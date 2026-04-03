"use client"
import React, { useState } from "react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import {
  Home,
  Monitor,
  ShoppingCart,
  Users,
  ChevronDown,
  ChevronsRight,
  TrendingUp,
  Activity,
  Package,
  Bell,
  Settings,
  User,
  FileText,
  DollarSign
} from "lucide-react";

export const Example = ({ stats, users, products, logs }: any) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className={`flex min-h-screen w-full dark`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} pendingReports={0} />
        <ExampleContent selected={selected} stats={stats} users={users} products={products} logs={logs} />
      </div>
    </div>
  );
};

const Sidebar = ({ open, setOpen, selected, setSelected, pendingReports }: any) => {
  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0c10] p-2 shadow-sm relative overflow-hidden`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
        <Option Icon={Home} title="Dashboard" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={Users} title="Members" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={ShoppingCart} title="Products" selected={selected} setSelected={setSelected} open={open} />
        <Option Icon={FileText} title="Admin Logs" selected={selected} setSelected={setSelected} open={open} />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: any) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-blue-50 dark:bg-pink-900/20 text-blue-700 dark:text-pink-400 shadow-sm border-l-2 border-pink-500" 
          : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <div className="grid h-full w-12 place-content-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-pink-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }: any) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 whitespace-nowrap ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    ADMIN PANEL
                  </span>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-500 dark:text-pink-400">
                    MarketHub Secured
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 shadow-sm border border-white/10">
      <Activity className="text-white w-5 h-5" />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-white/10 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 bg-[#0b0c10]"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 shrink-0 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-slate-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-gray-600 dark:text-slate-400 transition-opacity duration-200 whitespace-nowrap ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hide Panel
          </span>
        )}
      </div>
    </button>
  );
};

const ExampleContent = ({ selected, stats, users, products, logs }: any) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#050605] p-6 md:p-10 overflow-auto relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-pink-600/5 blur-[150px] pointer-events-none -z-10" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{selected}</h1>
          <p className="text-gray-600 dark:text-slate-500 mt-1 text-sm font-jetbrains uppercase tracking-widest">{selected === 'Dashboard' ? 'System Overview Live' : `Managing ${selected}`}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg border dark:border-white/10 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute 0 top-1 right-2 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
          </button>
          
          <button onClick={handleSignOut} className="p-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-colors flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" /> Logout Admin
          </button>
        </div>
      </div>
      
      {/* --- DASHBOARD VIEW --- */}
      {selected === "Dashboard" && (
        <React.Fragment>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 rounded-xl border dark:border-white/5 dark:bg-white/5 shadow-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 dark:bg-blue-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="font-medium dark:text-slate-400 mb-1">Total Sales Vol</h3>
              <p className="text-2xl font-bold dark:text-white font-jetbrains">₹{stats.totalSales.toLocaleString()}</p>
            </div>
            
            <div className="p-6 rounded-xl border dark:border-white/5 dark:bg-white/5 shadow-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 dark:bg-pink-500/20 rounded-lg">
                  <Users className="h-5 w-5 dark:text-pink-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="font-medium dark:text-slate-400 mb-1">Active Users</h3>
              <p className="text-2xl font-bold dark:text-white font-jetbrains">{stats.activeUsers}</p>
            </div>
            
            <div className="p-6 rounded-xl border dark:border-white/5 dark:bg-white/5 shadow-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 dark:bg-purple-500/20 rounded-lg">
                  <ShoppingCart className="h-5 w-5 dark:text-purple-400" />
                </div>
                <Activity className="h-4 w-4 text-slate-500" />
              </div>
              <h3 className="font-medium dark:text-slate-400 mb-1">Total Orders</h3>
              <p className="text-2xl font-bold dark:text-white font-jetbrains">{stats.totalOrders}</p>
            </div>

            <div className="p-6 rounded-xl border dark:border-white/5 dark:bg-white/5 shadow-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 dark:bg-amber-500/20 rounded-lg">
                  <Package className="h-5 w-5 dark:text-amber-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="font-medium dark:text-slate-400 mb-1">Live Listings</h3>
              <p className="text-2xl font-bold dark:text-white font-jetbrains">{stats.activeListings}</p>
            </div>
          </div>
          
          <div className="rounded-xl border dark:border-white/5 dark:bg-[#0b0c10] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">Recent Admin Activity</h3>
            </div>
            <div className="space-y-4">
              {logs.slice(0, 5).map((log: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <Activity className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{log.action}</p>
                      <p className="text-xs dark:text-slate-500 font-jetbrains">TARGET: {log.target_type || 'SYSTEM'} ID: {log.target_id || '-'}</p>
                    </div>
                  </div>
                  <div className="text-xs dark:text-slate-500 font-jetbrains">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      )}

      {/* --- MEMBERS VIEW --- */}
      {selected === "Members" && (
        <div className="rounded-xl border dark:border-white/5 dark:bg-[#0b0c10] shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="dark:bg-white/5 dark:text-slate-400 font-semibold border-b dark:border-white/10 text-xs uppercase tracking-widest font-jetbrains">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5">
              {users.map((u: any) => (
                <tr key={u.user_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-jetbrains">{u.user_id}</td>
                  <td className="px-6 py-4 font-medium dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 dark:text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs tracking-widest font-jetbrains uppercase ${u.is_admin ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 dark:text-slate-400 text-right font-jetbrains">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PRODUCTS VIEW --- */}
      {selected === "Products" && (
        <div className="rounded-xl border dark:border-white/5 dark:bg-[#0b0c10] shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="dark:bg-white/5 dark:text-slate-400 font-semibold border-b dark:border-white/10 text-xs uppercase tracking-widest font-jetbrains">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5">
              {products.map((p: any) => (
                <tr key={p.item_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-jetbrains">{p.item_id}</td>
                  <td className="px-6 py-4 font-medium dark:text-white">{p.title}</td>
                  <td className="px-6 py-4 font-jetbrains">₹{parseFloat(p.price).toLocaleString()}</td>
                  <td className="px-6 py-4 capitalize dark:text-slate-400">{p.condition_type}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] tracking-widest font-jetbrains uppercase ${p.status === 'available' ? 'bg-teal-500/20 text-teal-400' : p.status === 'sold' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADMIN LOGS VIEW --- */}
      {selected === "Admin Logs" && (
        <div className="rounded-xl border dark:border-white/5 dark:bg-[#0b0c10] shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="dark:bg-white/5 dark:text-slate-400 font-semibold border-b dark:border-white/10 text-xs uppercase tracking-widest font-jetbrains">
              <tr>
                <th className="px-6 py-4">Log ID</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Resource ID</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5">
              {logs.map((log: any) => (
                <tr key={log.log_id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-jetbrains">{log.log_id}</td>
                  <td className="px-6 py-4 font-medium dark:text-white">{log.action}</td>
                  <td className="px-6 py-4 dark:text-slate-400">{log.target_type || '-'}</td>
                  <td className="px-6 py-4 dark:text-slate-400">{log.target_id || '-'}</td>
                  <td className="px-6 py-4 dark:text-slate-400 text-right font-jetbrains text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
