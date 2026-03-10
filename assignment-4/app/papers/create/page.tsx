import Link from "next/link";
import CreatePaperForm from "@/components/CreatePaperForm";
import { Button } from "@/components/ui/button";
import type { Author } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

async function getAuthors(): Promise<Author[]> {
	// TODO: Fetch authors from Prisma, sorted by id ascending
	const authors = await prisma.author.findMany({
		orderBy: {
			id: "asc",
		},
	});
	return authors;
}

export default async function CreatePaper() {
	const authors = await getAuthors();

	return (
		<main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Create New Paper</h1>
				<Button asChild variant="ghost">
					<Link href="/">Back</Link>
				</Button>
			</div>

			<section className="rounded-lg border bg-card p-6">
				<CreatePaperForm authors={authors} />
			</section>
		</main>
	);
}
