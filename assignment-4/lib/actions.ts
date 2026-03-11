"use server";

import { prisma } from "./prisma";

export async function createPaper(formData: FormData) {
	const title = formData.get("title");
	const publishedIn = formData.get("publishedIn");
	const year = formData.get("year");
	const authorIds = formData.getAll("authorIds");

	if (!title || title?.toString().trim() === "") {
		throw new Error("Title is required");
	}

	if (!publishedIn || publishedIn?.toString().trim() === "") {
		throw new Error("Publication venue is required");
	}

	if (!year || year?.toString().trim() === "") {
		throw new Error("Publication year is required");
	}

	if (year && (!Number.isInteger(Number(year)) || Number(year) <= 1900)) {
		throw new Error("Valid year after 1900 is required");
	}

	if (authorIds.length === 0) {
		throw new Error("Please select at least one author");
	}

	await prisma.paper.create({
		data: {
			title: title.toString(),
			publishedIn: publishedIn.toString(),
			year: Number(year),
			authors: {
				connect: authorIds.map((id) => ({ id: Number(id) })),
			},
		},
	});
}

export async function createAuthor(formData: FormData) {
	const name = formData.get("name");
	const email = formData.get("email");
	const affiliation = formData.get("affiliation");

	if (!name || name.toString().trim() === "") {
		throw new Error("Name is required");
	}

	await prisma.author.create({
		data: {
			name: name.toString(),
			email: email ? email.toString() : null,
			affiliation: affiliation ? affiliation.toString() : null,
		},
	});
}
