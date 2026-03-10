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
        // TODO: Set success message and redirect to "/" after 3 seconds
      } catch (error) {
        // TODO: Set error message
      }
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        {/* TODO: Style this heading using Tailwind CSS with `text-2xl font-bold` */}
        <h1>Create New Author</h1>
        <Button asChild variant="ghost">
          {/* TODO: Link to home page `/` */}
          <Link>Back</Link>
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
          <input type="text" name="name" id="name" className={inputClass} />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email (optional)
          </label>
          {/* TODO: Add a text input for the email, styled with `inputClass` */}
        </div>

        <div className="space-y-1">
          <label htmlFor="affiliation" className="block text-sm font-medium">
            Affiliation (optional)
          </label>
          {/* TODO: Add a text input for the affiliation, styled with `inputClass` */}
        </div>

        <div className="flex items-center gap-3">
          {/* TODO: Disable the button during pending */}
          <Button data-testid="create-author-btn" type="submit">
            Create Author
          </Button>

          {/* TODO: Display status message using the required Tailwind CSS utility classes */}
          {message && <p data-testid="status-message">{/*TODO*/}</p>}
        </div>
      </form>
    </main>
  );
}
