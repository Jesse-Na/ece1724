import Link from "next/link";
import { Suspense } from "react";
import PaperList from "@/components/PaperList";
import { Button } from "@/components/ui/button";
import type { Paper } from "@/generated/prisma/client";

async function getPapers(): Promise<{
	papers: (Paper & { authors: { name: string }[] })[];
	error: string | null;
}> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/papers`,
		);
		if (!res.ok) {
			throw new Error("Failed to fetch papers");
		}
		const papers = await res.json();
		return { papers, error: null };
	} catch {
		return { papers: [], error: "Error loading papers" };
	}
}

async function PapersSection() {
	const { papers, error } = await getPapers();

	if (error) {
		return (
			<p
				data-testid="papers-error"
				className="text-sm text-muted-foreground"
			>
				Error loading papers
			</p>
		);
	}
	return <PaperList papers={papers} />;
}

export default async function Home() {
	return (
		<main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
			<header className="space-y-2">
				<h1 className="text-3xl font-bold">Paper Management System</h1>
			</header>

			<div className="flex gap-3">
				<Button asChild>
					<Link href="/papers/create">Create New Paper</Link>
				</Button>

				<Button asChild variant="secondary">
					<Link href="/authors/create">Create New Author</Link>
				</Button>
			</div>

			<section className="border rounded-lg p-6 space-y-4 bg-card">
				<h2 className="text-xl font-semibold">Papers</h2>
				<Suspense
					fallback={<p className="text-sm">Loading papers...</p>}
				>
					<PapersSection />
				</Suspense>
			</section>
		</main>
	);
}

export const dynamic = "force-dynamic";
