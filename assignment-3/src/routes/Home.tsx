// src/routes/Home.tsx
// This component serves as the home page, displaying the paper list and create form.

import { useState } from "react";
import type {
  Author,
  AuthorsListResponse,
  PaperFormData,
  PaperCreatePayload,
} from "../types";
import PaperForm from "../components/PaperForm";
import PaperList from "../components/PaperList";
import styles from "../styles/Home.module.css";

export default function Home() {
  /**
   * Message displayed after create success/failure.
   * Required messages:
   * - "Paper created successfully"
   * - "Error creating paper"
   */
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Implement paper creation logic.
   *
   * Steps required:
   * 1. Clear any previous message.
   * 2. Fetch all authors from GET /api/authors.
   * 3. Map selected authorIds (from PaperFormData)
   *    to full author objects required by backend.
   * 4. Construct PaperCreatePayload.
   * 5. Send POST /api/papers with JSON body.
   * 6. On success:
   *      - Set message "Paper created successfully"
   *      - Reload page after 3 seconds
   *        (No need to refresh paper list manually)
   * 7. On failure:
   *      - Set error "Error creating paper"
   *
   * Important:
   * Backend expects authors as objects (not just IDs).
   */
  const handleCreatePaper = async (paperData: PaperFormData) => {
    try {
      setMessage(null);

      const response = await fetch("/api/authors");
      if (!response.ok) {
        throw new Error();
      }

      const data: AuthorsListResponse = await response.json();

      const authors = paperData.authorIds.map((id) => {
        const author = data.authors.find((author) => author.id === id);
        return {
          name: author?.name!,
          email: author?.email ?? null,
          affiliation: author?.affiliation ?? null,
        };
      });

      const createPayload: PaperCreatePayload = {
        title: paperData.title,
        publishedIn: paperData.publishedIn,
        year: paperData.year,
        authors: authors,
      };

      const response2 = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createPayload),
      });

      if (!response2.ok) {
        throw new Error();
      }

      setMessage("Paper created successfully");

      setTimeout(() => window.location.reload(), 3000);
    } catch {
      setMessage("Error creating paper");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paper Management System</h1>

      {message && <div>{message}</div>}

      <h2 className={styles.sectionTitle}>Create New Paper</h2>
      <PaperForm onSubmit={handleCreatePaper} />

      <h2 className={styles.sectionTitle}>Papers</h2>
      <PaperList />
    </div>
  );
}
