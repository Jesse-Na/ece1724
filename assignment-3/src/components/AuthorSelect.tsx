// This component renders a multi-select dropdown for choosing authors.

import { useEffect, useState } from "react";
import type { Author, AuthorsListResponse } from "../types";

type AuthorSelectProps = {
  selectedAuthorIds: number[];
  onChange: (authorIds: number[]) => void;
};

export default function AuthorSelect({
  selectedAuthorIds,
  onChange,
}: AuthorSelectProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch authors from the API when this component mounts.
  //
  // Requirements:
  // - Endpoint: GET /api/authors
  // - If request fails: show "Error loading authors" above the dropdown
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");
        if (!response.ok) {
          throw new Error();
        }

        const data: AuthorsListResponse = await response.json();
        setAuthors(data.authors);
      } catch {
        setError("Error loading authors");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => Number(option.value),
    );

    onChange(selected);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <select
        multiple
        /**
         * Note: In the DOM, <select> option values are strings.
         * Converting IDs to strings keeps React controlled properly.
         */
        value={selectedAuthorIds.map(String)}
        onChange={handleChange}
        disabled={loading || error !== null}
      >
        {authors.length === 0 && <option disabled>No authors available</option>}
        {authors.map((author) => (
          <option value={author.id}>{author.name}</option>
        ))}
      </select>
    </div>
  );
}
