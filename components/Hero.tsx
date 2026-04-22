"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, PerspectiveCamera, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";
import * as random from "maath/random/dist/maath-random.esm";

function Particles() {
	const ref = useRef<THREE.Points>(null);
	const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 10 }));

	useFrame((state, delta) => {
		if (ref.current) {
			ref.current.rotation.x -= delta / 30;
			ref.current.rotation.y -= delta / 50;
		}
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
				<PointMaterial
					transparent
					color="#00D4FF"
					size={0.03}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0.4}
				/>
			</Points>
		</group>
	);
}

function Scene() {
	const knotRef = useRef<THREE.Mesh>(null);
	const [mouse, setMouse] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setMouse({
				x: (event.clientX / window.innerWidth) * 2 - 1,
				y: -(event.clientY / window.innerHeight) * 2 + 1,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useFrame(() => {
		if (knotRef.current) {
			// Continuous rotation
			knotRef.current.rotation.y += 0.005;
			knotRef.current.rotation.z += 0.003;

			// Mouse parallax tilt
			knotRef.current.rotation.x = THREE.MathUtils.lerp(knotRef.current.rotation.x, mouse.y * 0.2, 0.1);
			knotRef.current.rotation.y = THREE.MathUtils.lerp(knotRef.current.rotation.y, mouse.x * 0.2, 0.1);
		}
	});

	return (
		<>
			<ambientLight intensity={0.4} />
			<pointLight position={[10, 10, 10]} color="#00D4FF" intensity={3.5} />
			<pointLight position={[-10, 10, -10]} color="#7B61FF" intensity={3} />
			<pointLight position={[0, -10, 0]} color="#00D4FF" intensity={1} />

			<TorusKnot ref={knotRef} args={[1.2, 0.35, 128, 32]}>
				<meshStandardMaterial color="#00D4FF" metalness={1} roughness={0.15} emissive="#002b36" emissiveIntensity={0.2} />
			</TorusKnot>

			<Particles />

			<OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
		</>
	);
}

export default function Hero() {
	return (
		<section className="relative h-screen w-full bg-[#090909] overflow-hidden flex items-center justify-center">
			{/* 3D Scene Background */}
			<div className="absolute inset-0 z-0">
				<Canvas>
					<PerspectiveCamera makeDefault position={[0, 0, 5]} />
					<Scene />
				</Canvas>
			</div>

			{/* Content Overlay */}
			<div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
					<h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-6 mt-20">
						Git, <span className="text-primary italic">Reimagined.</span>
					</h1>
					<p className="text-xl md:text-2xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
						The next-generation Git client with AI-powered workflows, stunning performance, and a developer experience that
						feels like magic.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-6">
						<a href="#download" className="glow-cyan border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all px-10 py-4 rounded-full text-lg font-bold min-w-[240px] text-center">
							Download FluxGit
						</a>
						<Link href="/signup">
							<button className="border border-primary/60 bg-white/5 text-text-primary hover:bg-white/10 shadow-[0_0_15px_rgba(0,212,255,0.15)] transition-all px-10 py-4 rounded-full text-lg font-semibold min-w-[200px]">
								Request Access
							</button>
						</Link>
					</div>
				</motion.div>
			</div>

			{/* Animated Bottom Line */}
			<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent overflow-hidden">
				<motion.div
					className="h-full w-full bg-primary"
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
				/>
			</div>

			{/* Background Overlays */}
			<div className="absolute inset-0 scanlines opacity-50 pointer-events-none z-10" />
			<div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-10" />

			{/* Subtle Background Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
		</section>
	);
}
