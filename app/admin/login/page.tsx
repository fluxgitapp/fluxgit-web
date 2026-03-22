"use client";

import React, { useState } from "react";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await signIn(email, password);
      
      // Verify Role
      const uDoc = await getDoc(doc(db, "users", user.uid));
      const userData = uDoc.data();

      if (userData?.role === "admin") {
        Cookies.set("fb-role", "admin", { expires: 7 });
        router.push("/admin/console");
      } else {
        await signOut();
        setError("Access denied. Admin privileges required.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to access console.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] flex items-center justify-center p-6 text-white selection:bg-violet-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <Shield className="h-6 w-6 text-violet-400" />
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">FluxGit Admin Console</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 backdrop-blur-3xl rounded-[32px] p-8 shadow-2xl">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:border-violet-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                  placeholder="admin@fluxgit.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:border-violet-500/50 outline-none transition-all font-bold placeholder:text-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-bold">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_8px_30px_rgb(124,58,237,0.3)] mt-4"
            >
              {loading ? "Verifying Authority..." : "Access Console"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
