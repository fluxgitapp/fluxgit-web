"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download as DownloadIcon } from "lucide-react";

export default function Download() {
	return (
		<section id="download" className="py-24 bg-[#090909] relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="glass border-primary/20 p-12 md:p-20 rounded-[40px] max-w-4xl mx-auto overflow-hidden relative"
				>
					{/* Background Glow */}
					<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
					
					<div className="relative z-10">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							Latest Version: v1.0.0
						</div>

						<h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Download FluxGit</h2>
						<p className="text-xl text-text-muted mb-12 max-w-xl mx-auto">
							Experience the future of version control today. Optimized for performance and crafted for developers.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
							<a
								href="https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.0/FluxGit_1.0.0_x64_en-US.msi"
								target="_blank"
								rel="noopener noreferrer"
								className="glow-cyan w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-black font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
							>
								<DownloadIcon className="h-5 w-5" />
								Download .msi
							</a>
							<a
								href="https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.0/FluxGit_1.0.0_x64-setup.exe"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
							>
								<DownloadIcon className="h-5 w-5" />
								Download .exe
							</a>
						</div>

						<div className="flex items-center justify-center gap-4 text-sm text-text-muted font-medium">
							<span className="flex items-center gap-1.5">
								<div className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Windows only
							</span>
							<span className="w-[1px] h-4 bg-white/10" />
							<span className="flex items-center gap-1.5">
								<div className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Requires approval to access
							</span>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
