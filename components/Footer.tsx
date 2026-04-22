"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-[#090909] border-t border-primary/20 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
					<div className="flex items-center gap-2">
						<span className="text-2xl font-black tracking-tighter text-primary">FLUX<span className="text-white">GIT</span></span>
					</div>

					<div className="flex items-center gap-8 text-sm font-medium text-text-muted">
						<Link href="https://github.com/fluxgitapp/fluxgit" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</Link>
						<Link href="https://github.com/fluxgitapp/fluxgit#readme" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Documentation</Link>
						<Link href="https://github.com/fluxgitapp/fluxgit/issues" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Contact</Link>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-text-muted">
					<p>© 2026 FluxGit. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
						<Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
