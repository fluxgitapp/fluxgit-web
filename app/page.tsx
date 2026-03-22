import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Download from "@/components/Download";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import ProductDemo from "@/components/ProductDemo";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
			<Navbar />
			<main>
				<Hero />
				<Stats />
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
				<Features />
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
				<ProductDemo />
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
				<HowItWorks />
				<Download />
			</main>
			<Footer />
		</div>
	);
}
