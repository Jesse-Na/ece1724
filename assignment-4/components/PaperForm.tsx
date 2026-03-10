"use client";

import { Button } from "@/components/ui/button";
import type { Author } from "@/generated/prisma/client";
import { inputClass, selectClass } from "@/lib/ui";

type PaperFormProps = {
	action: (formData: FormData) => void | Promise<void>;
	authors: Author[];
};

export function PaperForm({ action, authors }: PaperFormProps) {
	return (
		<form action={action} className="space-y-4">
			<div className="space-y-1">
				<label htmlFor="title" className="block text-sm font-medium">
					Title
				</label>
				<input
					type="text"
					name="title"
					id="title"
					className={inputClass}
				/>
			</div>

			<div className="space-y-1">
				<label
					htmlFor="publishedIn"
					className="block text-sm font-medium"
				>
					Published In
				</label>
				<input
					type="text"
					name="publishedIn"
					id="publishedIn"
					className={inputClass}
				/>
			</div>

			<div className="space-y-1">
				<label htmlFor="year" className="block text-sm font-medium">
					Year
				</label>
				<input
					type="number"
					name="year"
					id="year"
					className={inputClass}
				/>
			</div>

			<div className="space-y-1">
				<label
					htmlFor="authorIds"
					className="block text-sm font-medium"
				>
					Authors
				</label>
				<select
					multiple
					name="authorIds"
					id="authorIds"
					className={selectClass}
					data-testid="author-dropdown"
				>
					{authors.length === 0 ? (
						<option disabled>No authors available</option>
					) : (
						authors.map((author) => (
							<option key={author.id} value={author.id}>
								{author.name}
							</option>
						))
					)}
				</select>
			</div>

			<Button data-testid="create-paper-btn" type="submit">
				Create Paper
			</Button>
		</form>
	);
}
