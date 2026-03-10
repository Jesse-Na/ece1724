import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	// TODO: Fetch all papers with authors, sorted by id ascending
	// TODO: Return as JSON response
	const papers = await prisma.paper.findMany({
		include: {
			authors: true,
		},
		orderBy: {
			id: "asc",
		},
	});
	return NextResponse.json(papers);
}
