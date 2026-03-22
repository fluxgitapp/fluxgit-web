"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getCurrentUser, signOut } from "@/lib/auth"; // Re-added signOut and getCurrentUser
import { approveUser, revokeUser, onUsersChange } from "@/lib/rsvp"; // Added RSVP imports
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore"; // Removed updateDoc
import { User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download as DownloadIcon, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  LayoutDashboard, 
  FileText, 
  User as UserIcon, 
  Shield, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Trash2, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Check,
  RefreshCcw,
  Camera,
  LucideIcon
} from "lucide-react";

// --- Internal Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, disabled = false }: { icon: LucideIcon, label: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]" 
        : "text-white/40 hover:text-white hover:bg-white/5"
    } ${disabled ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const FeatureBadge = ({ label, color = "primary" }: { label: string, color?: "primary" | "secondary" }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
    color === "primary" ? "bg-primary/10 border-primary/20 text-primary" : "bg-green-500/10 border-green-500/20 text-green-500"
  }`}>
    {label}
  </span>
);

const Accordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm font-bold text-white/80">{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/20 text-sm text-white/50 leading-relaxed border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ status?: string; role?: string; displayName?: string; photoURL?: string; createdAt?: { seconds: number } } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<{ uid: string; email: string; status: string; role?: string; createdAt?: { seconds: number } }[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/login");
          return;
        }
        setUser(currentUser);

        // Fetch deeper user data
        const uDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (uDoc.exists()) {
          const data = uDoc.data();
          setUserData(data);
          setDisplayName(data.displayName || "");
          
          // If admin, start real-time listener
          if (data.role === "admin") {
            onUsersChange((users) => {
              setAllUsers(users);
            });
          }
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const updateProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        displayName: displayName,
      }, { merge: true });
      if (userData) setUserData({ ...userData, displayName });
      alert("Profile updated!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `avatars/${user.uid}`);
    try {
      setSaving(true);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(db, "users", user.uid), { photoURL: url }, { merge: true });
      if (userData) setUserData({ ...userData, photoURL: url });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you SURE you want to delete your account? This cannot be undone.")) return;
    // Note: This only deletes Firestore data. Real auth deletion requires recent login.
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await handleLogout();
    } catch (err) {
      console.error(err);
      alert("Account deletion failed. Try logging in again first.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isApproved = userData?.status === "approved";
  const isAdmin = userData?.role === "admin";

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 bg-black/20 backdrop-blur-xl relative z-20">
        <div className="mb-12 px-2 py-4">
          <span className="text-2xl font-black tracking-tighter text-primary">
            FLUX<span className="text-white">GIT</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          <SidebarItem 
            icon={DownloadIcon} 
            label="Downloads" 
            active={activeTab === "downloads"} 
            onClick={() => setActiveTab("downloads")}
            disabled={!isApproved}
          />
          <SidebarItem 
            icon={FileText} 
            label="Changelog" 
            active={activeTab === "changelog"} 
            onClick={() => setActiveTab("changelog")}
            disabled={!isApproved}
          />
          <SidebarItem 
            icon={UserIcon} 
            label="Profile" 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
          />
          {isAdmin && (
            <SidebarItem 
              icon={Shield} 
              label="Admin" 
              active={activeTab === "admin"} 
              onClick={() => setActiveTab("admin")} 
            />
          )}
        </nav>

        <div className="mt-auto pt-8">
           <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#090909]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-white/20 md:block hidden">
            Console // {activeTab}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white/90">{userData?.displayName || user?.email?.split('@')[0]}</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-primary">{userData?.status}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black overflow-hidden ring-2 ring-primary/10 relative cursor-pointer group" onClick={() => setActiveTab("profile")}>
               {userData?.photoURL ? (
                 <Image src={userData.photoURL} alt="avatar" fill className="object-cover" />
               ) : (
                 user?.email?.charAt(0).toUpperCase()
               )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all border border-white/5 flex"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8 max-w-5xl w-full mx-auto pb-24">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="glass p-10 rounded-[40px] border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                  <h1 className="text-4xl font-bold mb-4">Welcome back, <span className="text-primary">{userData?.displayName || user?.email?.split('@')[0]}</span></h1>
                  <div className="flex items-center gap-3">
                    {isApproved ? (
                       <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="h-3 w-3" />
                        Access Approved
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                        <Clock className="h-3 w-3 animate-spin" />
                        Pending Review
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass p-6 rounded-3xl border-white/5 bg-white/2 pt-8">
                    <div className="text-xs uppercase tracking-widest font-black text-white/30 mb-2">Build Version</div>
                    <div className="text-3xl font-black text-white italic">v1.0.0</div>
                  </div>
                  <div className="glass p-6 rounded-3xl border-white/5 bg-white/2 pt-8">
                    <div className="text-xs uppercase tracking-widest font-black text-white/30 mb-2">Member Since</div>
                    <div className="text-3xl font-black text-white">
                      {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="glass p-6 rounded-3xl border-white/5 bg-white/2 pt-8">
                    <div className="text-xs uppercase tracking-widest font-black text-white/30 mb-2">Current Status</div>
                    <div className={`text-3xl font-black ${isApproved ? 'text-green-400' : 'text-amber-400'}`}>
                      {isApproved ? 'FULL ACCESS' : 'WAITLISTED'}
                    </div>
                  </div>
                </div>

                {!isApproved ? (
                  <div className="glass p-8 rounded-3xl border-amber-500/20 bg-amber-500/5">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                       <Clock className="h-5 w-5 text-amber-500" />
                       Waitlist Status
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       <div className="text-center md:text-left bg-black/40 px-8 py-6 rounded-2xl border border-white/5 flex-1 w-full">
                          <div className="text-4xl font-black text-white mb-2 italic">#42</div>
                          <div className="text-xs uppercase font-black tracking-widest text-white/40">Position in line</div>
                       </div>
                       <div className="text-center md:text-left bg-black/40 px-8 py-6 rounded-2xl border border-white/5 flex-1 w-full">
                          <div className="text-4xl font-black text-amber-500 mb-2">~36h</div>
                          <div className="text-xs uppercase font-black tracking-widest text-white/40">Estimated review time</div>
                       </div>
                       <button className="w-full md:w-auto px-8 py-6 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                          Check Status
                          <RefreshCcw className="h-5 w-5" />
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl border-white/5 bg-white/2">
                      <h2 className="text-xl font-bold mb-6">Setup Checklist</h2>
                      <div className="space-y-4">
                        {[
                          { text: "Request submitted", done: true },
                          { text: "Access approved", done: true },
                          { text: "Download FluxGit installer", done: false },
                          { text: "Install and launch FluxGit", done: false },
                          { text: "Configure your first Flux Stream", done: false },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 group">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                              item.done ? "bg-primary border-primary text-black" : "bg-white/5 border-white/10 text-white/20"
                            }`}>
                              {item.done && <Check className="h-4 w-4 stroke-[3px]" />}
                            </div>
                            <span className={`text-sm font-bold ${item.done ? "text-white/80" : "text-white/30"}`}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border-white/5 bg-white/2">
                      <h2 className="text-xl font-bold mb-6">Quick Links</h2>
                      <div className="space-y-3">
                        <button onClick={() => setActiveTab("downloads")} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                           <div className="flex items-center gap-3">
                              <DownloadIcon className="h-5 w-5 text-primary" />
                              <span className="font-bold">Download Center</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-primary transition-colors" />
                        </button>
                        <button onClick={() => setActiveTab("changelog")} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                           <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-secondary" />
                              <span className="font-bold">Release Notes</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-secondary transition-colors" />
                        </button>
                        <a href="#" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                           <div className="flex items-center gap-3">
                              <MessageSquare className="h-5 w-5 text-blue-400" />
                              <span className="font-bold">Join Discord</span>
                           </div>
                           <ExternalLink className="h-4 w-4 text-white/20 group-hover:text-blue-400 transition-colors" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* DOWNLOADS TAB */}
            {activeTab === "downloads" && (
              <motion.div
                key="downloads"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="glass p-10 rounded-[40px] border-primary/20 bg-primary/5">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div>
                        <FeatureBadge label="Latest Stable" color="primary" />
                        <h1 className="text-5xl font-black mt-4 mb-2 italic">v1.0.0</h1>
                        <p className="text-white/40 uppercase tracking-widest text-xs font-bold font-mono">Released March 12, 2026</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <a href="https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.0/FluxGit_1.0.0_x64_en-US.msi" target="_blank" className="glow-cyan flex items-center justify-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all">
                           <DownloadIcon className="h-5 w-5" />
                           Download .msi
                        </a>
                        <a href="https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.0/FluxGit_1.0.0_x64-setup.exe" target="_blank" className="flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">
                           <DownloadIcon className="h-5 w-5" />
                           Download .exe
                        </a>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6">Installation Tips</h2>
                    <Accordion title="Run as Administrator">
                      For the best experience on Windows, we recommend running the installer with administrative privileges. This ensures all background services for Flux Streams are correctly registered.
                    </Accordion>
                    <Accordion title="Signing Certificates">
                      Since FluxGit is in early access, you may need to trust the self-signed certificate during the first install. Once installed, future updates will be automatic and signed.
                    </Accordion>
                    <Accordion title="SmartScreen Warnings">
                      If Windows SmartScreen appears, click &quot;More Info&quot; and then &quot;Run Anyway.&quot; We are currently completing the EV code signing process with Microsoft.
                    </Accordion>
                  </div>

                  <div className="glass p-8 rounded-3xl border-white/5 bg-white/2">
                    <h2 className="text-2xl font-bold mb-6">Version History</h2>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="text-sm font-black text-primary italic">v1.0.0</div>
                             <div className="text-xs font-bold text-white/50">Initial Public Release</div>
                          </div>
                          <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active</div>
                       </div>
                       <div className="opacity-30 flex items-center justify-center py-12 text-xs uppercase font-black tracking-widest text-white/20 border-2 border-dashed border-white/5 rounded-xl italic">
                          Wait for future releases...
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHANGELOG TAB */}
            {activeTab === "changelog" && (
              <motion.div
                key="changelog"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                   <h1 className="text-4xl font-black italic tracking-tighter">Release Notes</h1>
                   <div className="flex gap-2">
                      <FeatureBadge label="Initial Release" />
                      <FeatureBadge label="March 2026" />
                   </div>
                </div>

                <div className="glass p-12 rounded-[40px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                   <div className="space-y-10">
                      <section>
                        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-primary" />
                           New Features
                        </h2>
                        <ul className="space-y-4 text-white/60 ml-5">
                          <li className="list-disc leading-relaxed">
                          <strong className="text-white">Virtual Flux Streams:</strong> Work on multiple branches simultaneously in the same working directory without stashing or switching.
                        </li>
                        <li className="list-disc leading-relaxed">
                          <strong className="text-white">AI Commit Messages:</strong> Integrated Gemini 2.5 Flash analysis for perfect, context-aware commit messages every time.
                        </li>
                          <li className="list-disc leading-relaxed">
                            <strong className="text-white">One-Click Push:</strong> Direct push to GitHub per Stream isolation.
                          </li>
                          <li className="list-disc leading-relaxed">
                            <strong className="text-white">RSVP Access Control:</strong> Tiered rollout management with waitlist prioritization.
                          </li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-secondary" />
                           Improvements
                        </h2>
                        <ul className="space-y-4 text-white/60 ml-5">
                           <li className="list-disc">Custom FluxGit branding system and unified UI theme.</li>
                           <li className="list-disc">Optimized Windows MSI and portable EXE installers.</li>
                           <li className="list-disc">Enhanced Framer Motion performance for smoother animations.</li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-red-400" />
                           Bug Fixes
                        </h2>
                        <ul className="space-y-4 text-white/60 ml-5">
                           <li className="list-disc">Resolved recurring white screen on startup in some environments.</li>
                           <li className="list-disc">Fixed broken CSS import paths for scoped workspace packages.</li>
                           <li className="list-disc">Patched memory leak in the 3D Hero background engine.</li>
                        </ul>
                      </section>
                   </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold">Account Settings</h1>

                <div className="glass p-10 rounded-3xl border-white/5 space-y-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-10">
                    <div className="relative group">
                       <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-5xl font-black text-primary overflow-hidden ring-8 ring-white/5 relative">
                          {userData?.photoURL ? (
                             <Image src={userData.photoURL} alt="pfp" fill className="object-cover" />
                          ) : (
                             user?.email?.charAt(0).toUpperCase()
                          )}
                       </div>
                       <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-black hover:scale-110 active:scale-90 transition-all shadow-xl border-4 border-[#090909]"
                       >
                         <Camera className="h-4 w-4 stroke-[3px]" />
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                    <div className="text-center md:text-left">
                       <h2 className="text-2xl font-bold mb-1">{userData?.displayName || 'User'}</h2>
                       <p className="text-white/40 font-mono text-sm">{user?.email}</p>
                       <div className="mt-4 flex gap-2 justify-center md:justify-start">
                          <FeatureBadge label={userData?.role || 'User'} color="secondary" />
                          <FeatureBadge label={userData?.status} color="primary" />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-xs uppercase font-black tracking-widest text-white/40 ml-1">Display Name</label>
                        <input 
                          type="text" 
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all font-bold"
                          placeholder="Your Name"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs uppercase font-black tracking-widest text-white/40 ml-1">Email (Locked)</label>
                        <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white/30 flex items-center justify-between cursor-not-allowed">
                           <span>{user?.email}</span>
                           <Lock className="h-4 w-4" />
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={updateProfile}
                    disabled={saving}
                    className="glow-cyan px-10 py-4 bg-primary text-black font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="glass p-10 rounded-3xl border-red-500/20 bg-red-500/5">
                   <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                   </h3>
                   <p className="text-white/40 text-sm mb-8">Once you delete your account, there is no going back. Please be certain.</p>
                   <button 
                    onClick={deleteAccount}
                    className="flex items-center gap-2 px-8 py-4 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl font-bold transition-all"
                   >
                     <Trash2 className="h-4 w-4" />
                     Delete Account
                   </button>
                </div>
              </motion.div>
            )}

            {/* ADMIN TAB */}
            {activeTab === "admin" && isAdmin && (
              <motion.div
                key="admin"
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
                   <div>
                     <h1 className="text-4xl font-black italic tracking-tighter mb-2">Admin Control</h1>
                     <p className="text-white/40">Manage user access and system oversight</p>
                   </div>
                   <div className="grid grid-cols-3 gap-6">
                      <div className="text-right">
                         <div className="text-2xl font-black text-white">{allUsers.length}</div>
                         <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">Total</div>
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-amber-500">{allUsers.filter(u => u.status === 'pending').length}</div>
                         <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">Pending</div>
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-green-500">{allUsers.filter(u => u.status === 'approved').length}</div>
                         <div className="text-[10px] uppercase font-black text-white/20 tracking-widest">Approved</div>
                      </div>
                   </div>
                </div>

                <div className="glass rounded-[32px] border-white/5 overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-white/5 border-b border-white/5">
                            <th className="p-6 text-xs uppercase font-black tracking-[0.2em] text-white/40">User</th>
                            <th className="p-6 text-xs uppercase font-black tracking-[0.2em] text-white/40">Status</th>
                            <th className="p-6 text-xs uppercase font-black tracking-[0.2em] text-white/40">Joined</th>
                            <th className="p-6 text-xs uppercase font-black tracking-[0.2em] text-white/40 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allUsers.map((u) => (
                          <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-6">
                               <div className="font-bold text-white/90">{u.email}</div>
                               <div className="text-[10px] text-white/20 font-mono italic">{u.uid}</div>
                            </td>
                            <td className="p-6">
                               {u.status === "approved" ? (
                                  <span className="text-[10px] font-black uppercase text-green-500 border border-green-500/20 bg-green-500/5 px-2 py-0.5 rounded">Approved</span>
                               ) : (
                                  <span className="text-[10px] font-black uppercase text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded">Pending</span>
                               )}
                            </td>
                            <td className="p-6 text-sm text-white/40">
                               {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-6 text-right">
                               {u.status === "pending" ? (
                                  <button 
                                    onClick={() => approveUser(u.uid)}
                                    className="px-4 py-2 bg-green-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all"
                                  >
                                    Approve
                                  </button>
                               ) : (
                                  <button 
                                    onClick={() => revokeUser(u.uid)}
                                    className="px-4 py-2 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all font-mono"
                                  >
                                    Revoke
                                  </button>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
