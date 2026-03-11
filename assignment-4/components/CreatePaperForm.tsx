"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Author } from "@/generated/prisma/client";
import { createPaper } from "@/lib/actions";
import { PaperForm } from "./PaperForm";

type CreatePaperFormProps = {
	authors: Author[];
};

export default function CreatePaperForm({ authors }: CreatePaperFormProps) {
	const [message, setMessage] = useState<string | null>(null);
	const router = useRouter();

	const handleAction = async (formData: FormData) => {
		try {
			await createPaper(formData);
			setMessage("Paper created successfully");
			setTimeout(() => {
				router.push("/");
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				setMessage(error.message);
			} else {
				setMessage("Error creating author");
			}
		}
	};

	return (
		<div className="space-y-4">
			<PaperForm action={handleAction} authors={authors} />

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
	);
}
