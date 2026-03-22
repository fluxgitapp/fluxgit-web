"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn(email, password);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Failed to sign in. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#090909] flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="glass max-w-md w-full p-8 md:p-12 rounded-[32px] border-primary/20 relative overflow-hidden"
			>
				{/* Background Glow */}
				<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

				<div className="relative z-10 text-center mb-10">
					<div className="flex justify-center mb-4">
						<span className="text-3xl font-black tracking-tighter text-primary">
							FLUX<span className="text-white">GIT</span>
						</span>
					</div>
					<h1 className="text-2xl font-bold text-white">Welcome Back</h1>
					<p className="text-text-muted mt-2">Sign in to manage your FluxGit account</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 relative z-10">
					{error && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl"
						>
							{error}
						</motion.div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-semibold text-text-primary ml-1">Email Address</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full bg-metal/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-text-primary ml-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full bg-metal/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="glow-cyan w-full bg-primary text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>

				<div className="mt-8 text-center relative z-10">
					<p className="text-text-muted text-sm">
						Don't have an account?{" "}
						<Link href="/signup" className="text-primary hover:underline font-bold">
							Request Access
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
}
