const GITHUB_API_URL = "https://api.github.com/repos/fluxgitapp/fluxgit/releases";

export interface ReleaseAsset {
	name: string;
	browser_download_url: string;
	size: number;
}

export interface GitHubRelease {
	tag_name: string;
	name: string;
	body: string;
	published_at: string;
	prerelease: boolean;
	draft: boolean;
	assets: ReleaseAsset[];
}

export interface FluxGitRelease {
	version: string;
	tagName: string;
	notes: string;
	publishedAt: string;
	isPrerelease: boolean;
	msiUrl: string | null;
	exeUrl: string | null;
	assets: ReleaseAsset[];
}

/**
 * Fetch the latest stable release from GitHub.
 */
export async function fetchLatestRelease(): Promise<FluxGitRelease | null> {
	try {
		const res = await fetch(`${GITHUB_API_URL}?per_page=10`, {
			headers: {
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
			},
			next: { revalidate: 300 }, // cache for 5 minutes in Next.js
		});

		if (!res.ok) return null;

		const releases: GitHubRelease[] = await res.json();

		// Find the latest non-draft, non-prerelease
		const latest = releases.find((r) => !r.draft && !r.prerelease);
		if (!latest) return null;

		return mapRelease(latest);
	} catch {
		return null;
	}
}

/**
 * Fetch all releases (stable + prerelease).
 */
export async function fetchAllReleases(limit = 10): Promise<FluxGitRelease[]> {
	try {
		const res = await fetch(`${GITHUB_API_URL}?per_page=${limit}`, {
			headers: {
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
			},
			next: { revalidate: 300 },
		});

		if (!res.ok) return [];

		const releases: GitHubRelease[] = await res.json();
		return releases.filter((r) => !r.draft).map(mapRelease);
	} catch {
		return [];
	}
}

function mapRelease(r: GitHubRelease): FluxGitRelease {
	const msiAsset = r.assets.find((a) => a.name.endsWith(".msi") && !a.name.endsWith(".zip"));
	const exeAsset = r.assets.find(
		(a) => (a.name.endsWith(".exe") || a.name.endsWith("-setup.exe")) && !a.name.endsWith(".zip"),
	);

	return {
		version: r.tag_name.replace(/^v/, ""),
		tagName: r.tag_name,
		notes: r.body ?? "",
		publishedAt: r.published_at,
		isPrerelease: r.prerelease,
		msiUrl: msiAsset?.browser_download_url ?? null,
		exeUrl: exeAsset?.browser_download_url ?? null,
		assets: r.assets,
	};
}
