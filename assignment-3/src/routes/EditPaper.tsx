// This component handles editing an existing paper.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PaperForm from "../components/PaperForm";
import type { Paper, PaperFormData, PaperUpdatePayload } from "../types";

export default function EditPaper() {
  const { id } = useParams(); // string | undefined
  const navigate = useNavigate();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  /**
   * Message displayed after update success/failure.
   * Required:
   * - "Paper updated successfully"
   * - "Error updating paper"
   */
  const [message, setMessage] = useState<string | null>(null);

  // Fetch paper details on mount and when id changes.
  //
  // Requirements:
  // - Endpoint: GET /api/papers/:id
  // - If 404: show "Paper not found"
  // - If other failure: show "Error loading paper"
  useEffect(() => {
    if (!id) {
      // Route should always provide it, but this keeps TS + runtime safe.
      setPaper(null);
      setLoading(false);
      return;
    }

    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/papers/${id}`);
        if (response.status === 404) {
          setPaper(null);
          return;
        }

        if (!response.ok) {
          throw new Error();
        }

        const data: Paper = await response.json();
        setPaper(data);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  // Implement update behavior.
  //
  // Requirements:
  // - Authors are NOT editable:
  //   - The dropdown is still rendered and selectable in the UI
  //   - BUT the PUT request must preserve the original authors from the fetched paper
  //
  // - Endpoint: PUT /api/papers/:id
  // - On success:
  //   - Render "Paper updated successfully" in the DOM
  //   - Navigate to "/" after 3 seconds
  //   - Any edits during the 3-second delay should not be recorded
  // - On failure:
  //   - Render "Error updating paper"
  const handleUpdatePaper = async (paperData: PaperFormData) => {
    if (!id || !paper) return;

    try {
      setMessage(null);

      // Build the update payload (PaperUpdatePayload):
      // - title, publishedIn, year come from paperData
      // - authors must come from the ORIGINAL fetched paper (paper.authors)
      const updatePayload: PaperUpdatePayload = {
        title: paperData.title,
        publishedIn: paperData.publishedIn,
        year: paperData.year,
        authors: paper.authors.map((author) => {
          return {
            name: author.name,
            email: author.email,
            affiliation: author.affiliation,
          };
        }),
      };

      const response = await fetch(`/api/papers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error();
      }

      setMessage("Paper updated successfully");
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setMessage("Error updating paper");
    }
  };

  if (loading) return <div>Loading paper details...</div>;
  if (loadError) return <div>Error loading paper</div>;
  if (!paper) return <div>Paper not found</div>;

  return (
    <div>
      <h1>Edit Paper</h1>

      <PaperForm paper={paper} onSubmit={handleUpdatePaper} />

      {message && <div>{message}</div>}
    </div>
  );
}
