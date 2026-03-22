"use client";

import React, { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { approveUser, revokeUser, onUsersChange } from "@/lib/rsvp";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  LogOut, 
  Users, 
  UserCheck, 
  UserPlus, 
  RefreshCcw,
  Search,
  Lock
} from "lucide-react";

export default function AdminConsolePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    const initAdmin = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/admin/login");
          return;
        }

        const uDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (uDoc.exists() && uDoc.data().role === "admin") {
          setUser(currentUser);
          unsubscribe = onUsersChange((users) => {
            setAllUsers(users);
          }, (err) => {
            console.error("Admin Console Listener Error:", err);
          });
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initAdmin();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.uid.includes(searchQuery)
  );

  const stats = {
    total: allUsers.length,
    pending: allUsers.filter(u => u.status === 'pending').length,
    approved: allUsers.filter(u => u.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-violet-500/30">
      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white/90">FluxGit Admin Console</h1>
            <p className="text-[10px] font-bold text-violet-400/60 uppercase tracking-widest">System Oversight v1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white/40 mb-0.5">Logged in as Authority</div>
            <div className="text-sm font-black text-violet-400">{user?.email}</div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm text-white/40"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Registrations", value: stats.total, icon: Users, color: "text-white" },
            { label: "Pending Approval", value: stats.pending, icon: UserPlus, color: "text-violet-400" },
            { label: "Active Operators", value: stats.approved, icon: UserCheck, color: "text-green-400" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon className="h-16 w-16" />
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">{s.label}</div>
              <div className={`text-5xl font-black ${s.color} italic`}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Users Table Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-black italic tracking-tight">Access Management</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search by email or UID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:border-violet-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-white/30 border-b border-white/5">
                  <th className="p-8">Operator Identity</th>
                  <th className="p-8">Access Status</th>
                  <th className="p-8">Inscribed Date</th>
                  <th className="p-8 text-right">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u) => (
                    <motion.tr 
                      key={u.uid}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-violet-500/[0.03] transition-colors group"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-black">
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white/90 group-hover:text-violet-400 transition-colors uppercase tracking-tight">{u.email}</div>
                            <div className="text-[10px] text-white/20 font-mono mt-1 flex items-center gap-1.5">
                              <Lock className="h-3 w-3" />
                              {u.uid}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        {u.status === "approved" ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest">
                            <UserCheck className="h-3 w-3" />
                            Approved
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <RefreshCcw className="h-3 w-3 animate-spin-slow" />
                            Pending
                          </div>
                        )}
                      </td>
                      <td className="p-8 text-sm font-bold text-white/30">
                        {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '---'}
                      </td>
                      <td className="p-8 text-right">
                        {u.status === "pending" ? (
                          <button 
                            onClick={() => approveUser(u.uid)}
                            className="px-6 py-2.5 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(124,58,237,0.3)]"
                          >
                            Grant Access
                          </button>
                        ) : (
                          <button 
                            onClick={() => revokeUser(u.uid)}
                            className="px-6 py-2.5 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="text-white/10 uppercase font-black tracking-widest text-xs italic">No matching operators found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-white/5 bg-black/40">
        <div className="text-[10px] uppercase font-black tracking-[0.5em] text-white/10">Authorized Personnel Only // Restricted Area</div>
      </footer>
    </div>
  );
}
