import type { Paper } from "@/generated/prisma/client";

interface PaperCardProps {
	paper: Paper & { authors: { name: string }[] };
}

export default function PaperCard({ paper }: PaperCardProps) {
	return (
		<li className="border rounded-lg p-4 bg-card space-y-2">
			<div className="space-y-1">
				<h3 className="text-lg font-semibold leading-snug">
					{paper.title}
				</h3>
				<p className="text-sm text-muted-foreground">
					{paper.publishedIn}
				</p>
				<p className="text-sm text-muted-foreground">{paper.year}</p>
			</div>

			<p className="text-sm">
				<span className="font-medium">Authors:</span>{" "}
				<span className="text-muted-foreground">
					{paper.authors.map((author) => author.name).join(", ")}
				</span>
			</p>
		</li>
	);
}
