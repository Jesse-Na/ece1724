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
    // TODO: Fetch papers from /api/papers endpoint
  } catch {
    return { papers: [], error: "Error loading papers" };
  }
}

async function PapersSection() {
  const { papers, error } = await getPapers();
  // TODO: Render papers or an error message based on getPapers() result
}

export default async function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2">
        {/* TODO: Style this heading using Tailwind CSS with `text-3xl font-bold` */}
        <h1>Paper Management System</h1>
      </header>

      <div className="flex gap-3">
        <Button asChild>
          {/* TODO: Navigate to `/papers/create` */}
          <Link>Create New Paper</Link>
        </Button>

        <Button asChild variant="secondary">
          {/* TODO: Navigate to `/authors/create` */}
          <Link>Create New Author</Link>
        </Button>
      </div>

      <section className="border rounded-lg p-6 space-y-4 bg-card">
        {/* TODO: Style this subheading using Tailwind CSS with `text-xl font-semibold` */}
        <h2>Papers</h2>
        {/* TODO: Implement Suspense to handle loading states
         */}
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";
