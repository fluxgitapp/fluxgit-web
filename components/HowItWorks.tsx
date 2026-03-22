"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
	{
		number: "01",
		title: "Request Access",
		description: "Join the waitlist for the FluxGit early access program.",
	},
	{
		number: "02",
		title: "Get Approved",
		description: "Our team reviews and approves developers for the beta.",
	},
	{
		number: "03",
		title: "Download & Install",
		description: "Get the v1.0.0 installer and start reimagining Git.",
	},
];

export default function HowItWorks() {
	return (
		<section className="py-24 bg-[#090909] border-t border-white/5">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-20">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-4xl md:text-5xl font-bold text-white mb-4"
					>
						How It Works
					</motion.h2>
					<div className="w-20 h-1 bg-primary mx-auto rounded-full glow-cyan" />
				</div>

				<div className="relative">
					{/* Connecting Line (Desktop) */}
					<div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-white/5 z-0">
						<motion.div
							initial={{ width: 0 }}
							whileInView={{ width: "100%" }}
							viewport={{ once: true }}
							transition={{ duration: 1.5, ease: "easeInOut" }}
							className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
						{steps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.2 }}
								className="flex flex-col items-center text-center"
							>
								<div className="w-24 h-24 rounded-full bg-metal border border-white/10 flex items-center justify-center mb-8 glow-cyan relative overflow-hidden group">
									<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<span className="text-3xl font-black text-primary relative z-10 tracking-tighter">{step.number}</span>
								</div>
								<h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
								<p className="text-text-muted max-w-[250px]">{step.description}</p>
							</motion.div>
						))}
					</div>
				</div>

				<div className="mt-20 text-center">
					<motion.button
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.8 }}
						className="text-primary hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
					>
						View Detailed Onboarding Guide
						<div className="w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center text-[10px]">→</div>
					</motion.button>
				</div>
			</div>
		</section>
	);
}
