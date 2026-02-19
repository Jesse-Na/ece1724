// This component displays a list of papers with edit and delete buttons.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/PaperList.module.css";
import type { Paper, PapersListResponse } from "../types";

export default function PaperList() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Error message to display when fetching papers fails.
   * Required text: "Error loading papers"
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Message area used for deletion success/failure messages.
   * Required texts:
   * - "Paper deleted successfully"
   * - "Error deleting paper"
   */
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch papers from the API when the component mounts.
  //
  // Requirements:
  // - Endpoint: GET /api/papers
  // - Loading state: render "Loading papers..."
  // - Error state: render "Error loading papers"
  // - Empty state: render "No papers found"
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch("/api/papers");
        if (!response.ok) {
          throw new Error();
        }

        const data: PapersListResponse = await response.json();
        setPapers(data.papers);
      } catch {
        setError("Error loading papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Implement delete functionality.
  //
  // Requirements:
  // - Clicking "Delete" must show confirm() dialog:
  //   `Are you sure you want to delete [paper title]?`
  // - If user clicks Cancel: do nothing
  // - If OK:
  //   - Send DELETE /api/papers/:id
  //   - On success: show "Paper deleted successfully" and remove it from the list
  //   - On failure: show "Error deleting paper"
  const handleDelete = async (paperId: number, paperTitle: string) => {
    setMessage(null);

    if (!confirm(`Are you sure you want to delete ${paperTitle}?`)) return;

    try {
      const response = await fetch(`/api/papers/${paperId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error();
      }

      setPapers(papers.filter((paper) => paper.id !== paperId));
      setMessage("Paper deleted successfully");
    } catch {
      setMessage("Error deleting paper");
    }
  };

  // Required state messages
  if (loading) return <div>Loading papers... </div>;
  if (error) return <div>{error}</div>;
  if (papers.length === 0) return <div>No papers found</div>;

  return (
    <div className={styles.container}>
      {message && <div>{message}</div>}

      {papers.map((paper) => (
        <div key={paper.id} className={styles.paper}>
          <h3 className={styles.paperTitle}>{paper.title}</h3>

          <p>
            Published in {paper.publishedIn}, {paper.year}
          </p>

          <p>Authors: {paper.authors.map((author) => author.name).join(", ")}</p>

          <button type="button" onClick={() => navigate(`edit/${paper.id}`)}>
            Edit
          </button>

          <button type="button" onClick={() => handleDelete(paper.id, paper.title)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
