import { fetchLatestRelease } from "@/lib/releases";
import { NextResponse } from "next/server";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
	const release = await fetchLatestRelease();

	if (!release) {
		return NextResponse.json(
			{
				version: "1.0.1",
				tagName: "v1.0.1",
				notes: "",
				publishedAt: new Date().toISOString(),
				isPrerelease: false,
				msiUrl: "https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.1/FluxGit_1.0.0_x64_en-US.msi",
				exeUrl: "https://github.com/fluxgitapp/fluxgit/releases/download/v1.0.1/FluxGit_1.0.0_x64-setup.exe",
				assets: [],
			},
			{ status: 200 },
		);
	}

	return NextResponse.json(release);
}
