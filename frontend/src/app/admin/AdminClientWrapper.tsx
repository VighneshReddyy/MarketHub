"use client";

import React, { useState } from "react";
import { AdminLayoutWrapper } from "@/components/ui/admin-layout-wrapper";

export function AdminClientWrapper({ stats, users, items, logs, categories, reports, reviews }: any) {
  const [activePage, setActivePage] = useState("Item Management");

  return (
    <AdminLayoutWrapper activePage={activePage} setActivePage={setActivePage}>
      {activePage === "Dashboard" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Dashboard</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white border rounded shadow p-6">
               <div className="text-sm text-slate-500 font-medium">Total Users</div>
               <div className="text-3xl font-bold text-slate-800 mt-2">{stats.activeUsers}</div>
            </div>
            <div className="bg-white border rounded shadow p-6">
               <div className="text-sm text-slate-500 font-medium">Total Items</div>
               <div className="text-3xl font-bold text-slate-800 mt-2">{items.length}</div>
            </div>
            <div className="bg-white border rounded shadow p-6">
               <div className="text-sm text-slate-500 font-medium">Pending Reports</div>
               <div className="text-3xl font-bold text-slate-800 mt-2">{reports?.filter((r: any) => r.status === 'pending').length || 0}</div>
            </div>
            <div className="bg-white border rounded shadow p-6">
               <div className="text-sm text-slate-500 font-medium">Total Orders</div>
               <div className="text-3xl font-bold text-slate-800 mt-2">{stats.totalOrders}</div>
            </div>
          </div>
        </div>
      )}

      {activePage === "User Management" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h2>
          <div className="flex gap-4 mb-4">
             <input type="text" placeholder="Search name/email..." className="border border-slate-300 rounded px-3 py-2 w-64 text-sm" />
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm">Search</button>
             <div className="flex-1" />
             <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm">Ban User</button>
             <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm">Unban User</button>
          </div>
          <table className="w-full text-left border border-slate-200">
            <thead className="bg-[#e9ecef] border-b border-slate-300">
              <tr>
                <th className="py-2 px-4 font-semibold text-slate-700">ID</th>
                <th className="py-2 px-4 font-semibold text-slate-700">Name</th>
                <th className="py-2 px-4 font-semibold text-slate-700">Email</th>
                <th className="py-2 px-4 font-semibold text-slate-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any, idx: number) => (
                <tr key={u.user_id} className={`border-b border-slate-100 ${idx % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                  <td className="py-2 px-4 text-slate-700">{u.user_id}</td>
                  <td className="py-2 px-4 text-slate-700">{u.name}</td>
                  <td className="py-2 px-4 text-slate-700">{u.email}</td>
                  <td className="py-2 px-4 text-slate-700">{u.is_admin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activePage === "Item Management" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Item Management</h2>
          <div className="flex gap-4 mb-4 items-center">
             <input type="text" placeholder="Filter by title..." className="border border-slate-300 rounded px-3 py-2 w-64 text-sm focus:outline-blue-500" />
             <select className="border border-slate-300 rounded px-3 py-2 w-48 text-sm bg-white">
                <option value="">Category...</option>
                {categories?.map((c: any) => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
             </select>
             <button className="bg-[#0d6efd] hover:bg-blue-700 text-white px-5 py-2 rounded shadow-sm font-medium text-sm transition-colors">Filter</button>
             <button className="bg-[#dc3545] hover:bg-red-700 text-white px-5 py-2 rounded shadow-sm font-medium text-sm transition-colors">Mark as Removed</button>
          </div>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#e9ecef] border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-sm text-slate-800 w-16 border-r border-slate-200">ID</th>
                  <th className="py-2.5 px-4 font-semibold text-sm text-slate-800 border-r border-slate-200">Title</th>
                  <th className="py-2.5 px-4 font-semibold text-sm text-slate-800 w-48 border-r border-slate-200">Seller</th>
                  <th className="py-2.5 px-4 font-semibold text-sm text-slate-800 w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, idx: number) => (
                  <tr key={item.item_id} className={`border-b border-slate-100 hover:bg-blue-50/30 ${idx % 2 !== 0 ? 'bg-[#fcfcfc]' : 'bg-white'}`}>
                    <td className="py-2.5 px-4 text-sm text-slate-700 border-r border-slate-100">{item.item_id}</td>
                    <td className="py-2.5 px-4 text-sm text-slate-700 border-r border-slate-100">{item.title}</td>
                    <td className="py-2.5 px-4 text-sm text-slate-700 border-r border-slate-100">{item.seller_name || 'System'}</td>
                    <td className="py-2.5 px-4 text-sm text-slate-700">{item.status}</td>
                  </tr>
                ))}
                {/* Empty rows to match visual size from screenshot if few items exist */}
                {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
                   <tr key={`empty-${i}`} className="border-b border-slate-100 h-10">
                     <td className="border-r border-slate-100"></td>
                     <td className="border-r border-slate-100"></td>
                     <td className="border-r border-slate-100"></td>
                     <td></td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activePage === "Category Management" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Category Management</h2>
          <div className="flex gap-4">
             <input type="text" placeholder="New Category Name..." className="border border-slate-300 rounded px-3 py-2 w-64 text-sm" />
             <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded font-medium text-sm">Add</button>
             <button className="bg-[#dc3545] hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm">Delete Selected</button>
          </div>
          <div className="border border-slate-200 rounded overflow-hidden max-w-lg">
             <ul className="divide-y divide-slate-200 max-h-[500px] overflow-auto">
               {categories?.map((c: any) => (
                  <li key={c.category_id} className="py-3 px-4 text-sm hover:bg-slate-50 cursor-pointer">{c.name} {c.parent_id && <span className="text-slate-400 text-xs ml-2">(Subcategory)</span>}</li>
               ))}
             </ul>
          </div>
        </div>
      )}

      {activePage === "Reports Management" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pending Reports</h2>
          <div className="flex gap-4">
             <button className="bg-[#dc3545] hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm">Ban User</button>
             <button className="bg-[#fd7e14] hover:bg-orange-600 text-white px-4 py-2 rounded font-medium text-sm">Remove Item</button>
             <button className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium text-sm">Ignore</button>
          </div>
          <div className="border border-slate-200 rounded overflow-hidden">
             <ul className="divide-y divide-slate-200 max-h-[600px] overflow-auto">
               {reports?.map((r: any) => (
                  <li key={r.report_id} className="py-3 px-4 text-sm hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">Report #{r.report_id}:</span> {r.reason} (Target: {r.reported_user_name || '-'}, Item: {r.item_title || '-'})
                    <span className="ml-4 inline-block px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{r.status}</span>
                  </li>
               ))}
             </ul>
          </div>
        </div>
      )}

      {activePage === "Review Moderation" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Review Moderation</h2>
          <button className="bg-[#dc3545] text-white px-4 py-2 rounded font-medium text-sm hover:bg-red-700">Delete Review</button>
          <div className="border border-slate-200 rounded overflow-hidden">
             <ul className="divide-y divide-slate-200 max-h-[600px] overflow-auto">
               {reviews?.map((r: any) => (
                  <li key={r.review_id} className="py-3 px-4 text-sm hover:bg-slate-50">
                    <span className="font-bold text-slate-800">[{r.rating}*]</span> {r.comment} <span className="text-slate-500">— (by {r.reviewer_name} | Seller: {r.seller_name})</span>
                  </li>
               ))}
             </ul>
          </div>
        </div>
      )}

      {activePage === "Admin Logs" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Action Logs</h2>
          <table className="w-full text-left border border-slate-200">
            <thead className="bg-[#e9ecef] border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-4 font-semibold text-slate-700 text-sm">Log ID</th>
                <th className="py-2.5 px-4 font-semibold text-slate-700 text-sm">Action</th>
                <th className="py-2.5 px-4 font-semibold text-slate-700 text-sm">Target</th>
                <th className="py-2.5 px-4 font-semibold text-slate-700 text-sm">Target ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any, idx: number) => (
                <tr key={log.log_id} className={`border-b border-slate-100 ${idx % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                  <td className="py-2.5 px-4 text-sm text-slate-700">{log.log_id}</td>
                  <td className="py-2.5 px-4 text-sm text-slate-700">{log.action}</td>
                  <td className="py-2.5 px-4 text-sm text-slate-700">{log.target_type || '-'}</td>
                  <td className="py-2.5 px-4 text-sm text-slate-700">{log.target_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
