"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Zap, MousePointer2 } from "lucide-react";

const features = [
	{
		title: "Virtual Branches",
		description: "Work on multiple features simultaneously without the overhead of context switching. Stay in the flow.",
		icon: <Layers className="h-8 w-8 text-primary" />,
	},
	{
		title: "AI Commit Messages",
		description: "Generate meaningful, context-aware commit messages in seconds, powered by Google Gemini 2.5 Flash.",
		icon: <Zap className="h-8 w-8 text-primary" />,
	},
	{
		title: "One-Click Workflows",
		description: "Streamline complex Git operations into single-click actions. Built for speed and developer happiness.",
		icon: <MousePointer2 className="h-8 w-8 text-primary" />,
	},
];

export default function Features() {
	return (
		<section id="features" className="py-24 bg-[#090909] relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-20">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-4xl md:text-5xl font-bold text-white mb-4"
					>
						Built for the <span className="text-primary italic">modern</span> developer.
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-xl text-text-muted max-w-2xl mx-auto"
					>
						FluxGit takes the friction out of version control, letting you focus on what matters: the code.
					</motion.p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							whileHover={{ 
								rotateY: index % 2 === 0 ? 5 : -5, 
								rotateX: 2,
								translateZ: 20
							}}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="glass group p-8 rounded-3xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] cursor-default"
						>
							<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 glow-cyan group-hover:scale-110 transition-transform duration-500">
								{feature.icon}
							</div>
							<h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
							<p className="text-text-muted leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>

			{/* Decorative background element */}
			<div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
		</section>
	);
}
