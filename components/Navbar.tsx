"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ? "glass py-3" : "bg-transparent py-5"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="flex-shrink-0">
							<span className="text-2xl font-bold text-primary tracking-tight">FluxGit</span>
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-8">
							<Link
								href="#features"
								className="text-text-muted hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
							>
								Features
							</Link>
							<Link
								href="#download"
								className="text-text-muted hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
							>
								Download
							</Link>
							<Link
								href="/login"
								className="text-text-muted hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
							>
								Login
							</Link>
							<Link
								href="/signup"
								className="glow-cyan border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all px-6 py-2.5 rounded-full text-sm font-semibold"
							>
								Get Early Access
							</Link>
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-text-muted hover:text-primary p-2 transition-colors"
						>
							{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden glass border-t border-white/5 animate-in slide-in-from-top duration-300">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
						<Link
							href="#features"
							onClick={() => setIsOpen(false)}
							className="text-text-muted hover:text-primary block px-3 py-3 text-base font-medium"
						>
							Features
						</Link>
						<Link
							href="#download"
							onClick={() => setIsOpen(false)}
							className="text-text-muted hover:text-primary block px-3 py-3 text-base font-medium"
						>
							Download
						</Link>
						<Link
							href="/login"
							onClick={() => setIsOpen(false)}
							className="text-text-muted hover:text-primary block px-3 py-3 text-base font-medium"
						>
							Login
						</Link>
						<div className="pt-4 pb-2">
							<Link
								href="/signup"
								onClick={() => setIsOpen(false)}
								className="glow-cyan border border-primary/30 bg-primary/10 text-primary inline-block px-10 py-3 rounded-full text-base font-semibold"
							>
								Get Early Access
							</Link>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
