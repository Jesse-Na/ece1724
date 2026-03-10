import type { Paper } from "@/generated/prisma/client";
import PaperCard from "./PaperCard";

type PaperListProps = {
	papers: (Paper & { authors: { name: string }[] })[];
};

export default function PaperList({ papers }: PaperListProps) {
	if (papers.length === 0) {
		return <p className="text-sm text-muted-foreground">No papers found</p>;
	}

	return (
		<ul className="space-y-4" data-testid="paper-list">
			{papers.map((paper) => (
				<li key={paper.id}>
					<PaperCard paper={paper} />
				</li>
			))}
		</ul>
	);
}
