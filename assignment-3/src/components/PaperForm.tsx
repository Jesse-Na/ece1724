// This component renders a form for creating or editing a paper.

import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/PaperForm.module.css";
import AuthorSelect from "./AuthorSelect";
import type { Paper, PaperFormData } from "../types";

type PaperFormProps = {
  paper?: Paper; // undefined in create mode
  onSubmit: (data: PaperFormData) => Promise<void> | void;
};

export default function PaperForm({ paper, onSubmit }: PaperFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PaperFormData>({
    title: paper?.title ?? "",
    publishedIn: paper?.publishedIn ?? "",
    year: paper?.year ?? new Date().getFullYear(),
    authorIds: paper?.authors?.map((author) => author.id) ?? [],
  });

  /**
   * Store a validation error message.
   * Show ONLY the first error encountered.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Implement validation in EXACT required order:
   *
   * 1. Title is required
   * 2. Publication venue is required
   * 3. Publication year is required
   * 4. Valid year after 1900 is required
   * 5. Please select at least one author (create mode only)
   *
   * Important:
   * - Show ONLY the first error.
   * - In edit mode, skip author validation.
   * - Call onSubmit(formData) only if validation passes.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      setError("Title is required");
      return;
    }

    if (formData.publishedIn.trim() === "") {
      setError("Publication venue is required");
      return;
    }

    if (formData.year === 0) {
      setError("Publication year is required");
      return;
    }

    if (!Number.isInteger(formData.year) || formData.year <= 1900) {
      setError("Valid year after 1900 is required");
      return;
    }

    if (!paper && formData.authorIds.length === 0) {
      setError("Please select at least one author");
      return;
    }

    setError(null);

    // Parent component (Home/EditPaper) handles API calls and success/error messages.
    await onSubmit(formData);
  };

  /**
   * Handle changes for text and number inputs.
   *
   * Hint:
   * - Use e.target.name
   * - If name === "year", convert value to number
   * - Otherwise store as string
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "year") {
      setFormData({ ...formData, year: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className="error">{error}</div>}

      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="publishedIn">Published In:</label>
        <input
          type="text"
          id="publishedIn"
          name="publishedIn"
          value={formData.publishedIn}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
      </div>

      <fieldset>
        <legend>Authors:</legend>

        {/*
          In edit mode:
          - Dropdown is still rendered and selectable.
          - However, changing selection must NOT affect the authors
            sent in the PUT request.
          - That logic will be handled in EditPaper.tsx.
        */}
        <AuthorSelect
          selectedAuthorIds={formData.authorIds}
          onChange={(authorIds) =>
            setFormData((prev) => ({
              ...prev,
              authorIds,
            }))
          }
        />
      </fieldset>

      <div>
        <button type="submit">{paper ? "Update Paper" : "Create Paper"}</button>

        {paper && (
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
