"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, Eye, MessageSquare, Star, Bell } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";

export default function Dashboard() {
  const { skills, orders, notifications, toggleSkillStatus, markAllNotificationsRead } = useDashboardContext();

  const activeSkills = skills.filter(s => s.status === "Active" || s.status === "Paused");

  if (skills.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
          <p className="text-muted-foreground text-base">Track the status of the services you've purchased.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Orders Table */}
          <div className="lg:col-span-8 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-bold text-base">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Seller</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Service</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Amount</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Due</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {orders.map((order, idx) => (
                    <tr key={idx} className={`hover:bg-muted/30 transition-colors ${idx !== orders.length - 1 ? 'border-b border-border/30' : ''}`}>
                      <td className="px-5 py-3.5 font-medium">{order.buyerName}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{order.service}</td>
                      <td className="px-5 py-3.5 font-semibold">₹{order.amount}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] tracking-wider uppercase ${
                          order.status === "In Progress" ? "bg-amber-500/20 text-amber-500" :
                          order.status === "Delivered" ? "bg-green-500/20 text-green-500" :
                          order.status === "In Review" ? "bg-blue-500/20 text-blue-500" :
                          "bg-zinc-500/20 text-zinc-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{order.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side: Notifications */}
          <div className="lg:col-span-4 bg-card border border-border rounded-xl shadow-sm flex flex-col h-fit">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-bold text-base">Notifications</h2>
              <button onClick={markAllNotificationsRead} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Mark all read
              </button>
            </div>
            <div className="p-0 flex flex-col">
              {notifications.map((notif, idx) => (
                <div key={notif.id} className={`p-5 flex items-start gap-4 transition-opacity duration-500 ${notif.read ? 'opacity-50' : 'opacity-100'} ${idx !== notifications.length - 1 ? 'border-b border-border/30' : ''}`}>
                  <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${notif.type === 'order' ? 'bg-green-500' : notif.type === 'message' ? 'bg-blue-500' : notif.type === 'review' ? 'bg-amber-500' : 'bg-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-snug">
                      {notif.type === 'order' && "🟢 "}
                      {notif.type === 'message' && "💬 "}
                      {notif.type === 'review' && "⭐ "}
                      {notif.type === 'view' && "🔔 "}
                      {notif.text}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0">{notif.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      {/* ROW 1: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card 1 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Total Earnings</h3>
          <div className="text-[28px] font-bold leading-tight mb-2">₹12,450</div>
          <div className="text-sm font-semibold text-green-500 flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5" /> +18% this month
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Active Orders</h3>
          <div className="text-[28px] font-bold leading-tight mb-2">3</div>
          <div className="text-sm font-semibold text-amber-500 flex items-center gap-1">
            2 pending review
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Profile Views</h3>
          <div className="text-[28px] font-bold leading-tight mb-2">284</div>
          <div className="text-sm font-semibold text-green-500 flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5" /> +34% this week
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Completion Rate</h3>
          <div className="text-[28px] font-bold leading-tight mb-2">94%</div>
          <div className="text-sm font-semibold text-green-500 flex items-center gap-1">
            Above average
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left: Recent Orders */}
        <div className="lg:col-span-7 xl:col-span-8 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-base">Recent Orders</h2>
            <Link href="#" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Buyer</th>
                  <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Service</th>
                  <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Amount</th>
                  <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-[13px] font-semibold text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {orders.map((order, idx) => (
                  <tr key={idx} className={`hover:bg-muted/30 transition-colors ${idx !== orders.length - 1 ? 'border-b border-border/30' : ''}`}>
                    <td className="px-5 py-3.5 font-medium">{order.buyerName}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{order.service}</td>
                    <td className="px-5 py-3.5 font-semibold">₹{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] tracking-wider uppercase ${
                        order.status === "In Progress" ? "bg-amber-500/20 text-amber-500" :
                        order.status === "Delivered" ? "bg-green-500/20 text-green-500" :
                        order.status === "In Review" ? "bg-blue-500/20 text-blue-500" :
                        "bg-zinc-500/20 text-zinc-400"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{order.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Earnings Chart */}
        <div className="lg:col-span-5 xl:col-span-4 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-base">Earnings</h2>
            <span className="text-sm font-semibold text-muted-foreground">Last 6 months</span>
          </div>
          <div className="p-5 flex-1 flex items-end gap-2 sm:gap-4 h-[240px]">
            {/* Chart Container */}
            {[
              { month: "Jan", val: "₹1.2k", height: "37%" },
              { month: "Feb", val: "₹2.1k", height: "65%" },
              { month: "Mar", val: "₹1.8k", height: "56%" },
              { month: "Apr", val: "₹3.2k", height: "100%" },
              { month: "May", val: "₹2.9k", height: "90%" },
              { month: "Jun", val: "₹1.2k", height: "37%", muted: true },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                <div className="text-[11px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-2">{bar.val}</div>
                <div 
                  className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${bar.muted ? 'bg-primary/40' : 'bg-primary'}`}
                  style={{ height: bar.height }}
                />
                <div className="text-[11px] font-semibold text-muted-foreground mt-3 uppercase tracking-wider">{bar.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: My Active Skills */}
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-base">My Skills</h2>
            <Link href="/dashboard/my-skills" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Manage &rarr;
            </Link>
          </div>
          <div className="p-0 flex flex-col">
            {activeSkills.map((skill, idx) => (
              <div key={skill.id} className={`p-5 flex items-center gap-4 ${idx !== activeSkills.length - 1 ? 'border-b border-border/30' : ''}`}>
                <div className={`h-3 w-3 rounded-full shrink-0 ${skill.catColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate mb-1">{skill.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {skill.views} views</span>
                    <span>·</span>
                    <span>📦 {skill.orders} orders</span>
                    <span>·</span>
                    <span className="font-medium">₹{skill.earned} earned</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSkillStatus(skill.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${skill.status === "Active" ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground border border-border'}`}
                >
                  {skill.status === "Active" ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-base">Notifications</h2>
            <button onClick={markAllNotificationsRead} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Mark all read
            </button>
          </div>
          <div className="p-0 flex flex-col">
            {notifications.map((notif, idx) => (
              <div key={notif.id} className={`p-5 flex items-start gap-4 transition-opacity duration-500 ${notif.read ? 'opacity-50' : 'opacity-100'} ${idx !== notifications.length - 1 ? 'border-b border-border/30' : ''}`}>
                <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${notif.type === 'order' ? 'bg-green-500' : notif.type === 'message' ? 'bg-blue-500' : notif.type === 'review' ? 'bg-amber-500' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-snug">
                    {notif.type === 'order' && "🟢 "}
                    {notif.type === 'message' && "💬 "}
                    {notif.type === 'review' && "⭐ "}
                    {notif.type === 'view' && "🔔 "}
                    {notif.text}
                  </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0">{notif.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
