"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createAuthor } from "@/lib/actions";
import { inputClass } from "@/lib/ui";

export default function CreateAuthor() {
	const [message, setMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleAction = async (formData: FormData) => {
		startTransition(async () => {
			try {
				// TODO: Call createAuthor Server Action
				await createAuthor(formData);
				// TODO: Set success message and redirect to "/" after 3 seconds
				setMessage("Author created successfully");
				setTimeout(() => {
					router.push("/");
				}, 3000);
			} catch (error) {
				// TODO: Set error message
				if (error instanceof Error) {
					setMessage(error.message);
				} else {
					setMessage("Error creating author");
				}
			}
		});
	};

	return (
		<main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Create New Author</h1>
				<Button asChild variant="ghost">
					<Link href="/">Back</Link>
				</Button>
			</div>

			<form
				action={handleAction}
				className="border rounded-lg p-6 space-y-4 bg-card"
			>
				<div className="space-y-1">
					<label htmlFor="name" className="block text-sm font-medium">
						Name
					</label>
					<input
						type="text"
						name="name"
						id="name"
						className={inputClass}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="email"
						className="block text-sm font-medium"
					>
						Email (optional)
					</label>
					<input
						type="email"
						name="email"
						id="email"
						className={inputClass}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="affiliation"
						className="block text-sm font-medium"
					>
						Affiliation (optional)
					</label>
					<input
						type="text"
						name="affiliation"
						id="affiliation"
						className={inputClass}
					/>
				</div>

				<div className="flex items-center gap-3">
					<Button
						data-testid="create-author-btn"
						type="submit"
						disabled={isPending}
					>
						Create Author
					</Button>

					{/* TODO: Display status message using the required Tailwind CSS utility classes */}
					{message && (
						<p
							data-testid="status-message"
							className={
								message.includes("successfully")
									? "text-sm"
									: "text-sm text-red-800"
							}
						>
							{message}
						</p>
					)}
				</div>
			</form>
		</main>
	);
}
