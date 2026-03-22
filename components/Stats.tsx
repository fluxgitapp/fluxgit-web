"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
	{ value: 10, suffix: "x", label: "Faster Workflows" },
	{ value: "AI-Powered", suffix: "", label: "Commit Messages" },
	{ value: 100, suffix: "%", label: "Git Compatible" },
];

function Counter({ value, suffix, label }: { value: number | string; suffix: string; label: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className="text-center"
		>
			<div className="text-5xl md:text-7xl font-black text-primary mb-2 tracking-tight">
				{value}
				<span className="text-primary/60">{suffix}</span>
			</div>
			<div className="text-lg text-text-muted font-medium uppercase tracking-widest">{label}</div>
		</motion.div>
	);
}

export default function Stats() {
	return (
		<section className="py-24 bg-[#090909] relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
					{stats.map((stat, index) => (
						<Counter key={index} {...stat} />
					))}
				</div>
			</div>
			
			{/* Decorative divider particles placeholder */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
		</section>
	);
}
