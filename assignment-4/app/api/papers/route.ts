import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
