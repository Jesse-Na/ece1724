import { Router } from "express";
import { db } from "../database";
import * as middleware from "../middleware";
import type { ValidatedLocals } from "../types";

const router = Router();

// -----------------------
// Helper (provided)
// -----------------------
function isErrorWithMessage(e: unknown): e is { message: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as { message?: unknown }).message === "string"
  );
}

// -----------------------
// GET /api/authors
// -----------------------
/**
 * List authors with optional query parameters.
 *
 * Requirements:
 * - Apply validateAuthorQueryParams middleware
 * - Support optional query params:
 *   - name
 *   - affiliation
 *   - limit (default 10)
 *   - offset (default 0)
 * - Call db.getAllAuthors(...) with parsed values
 * - Return the result as JSON
 */
router.get(
  "/",
  // TODO: attach validateAuthorQueryParams middleware
  async (req, res, next) => {
    try {
      // TODO: read validated query params from res.locals
      // const { authorQuery } = res.locals as ValidatedLocals;
      // TODO: apply defaults for limit and offset
      // TODO: call db.getAllAuthors({ name, affiliation, limit, offset })
      // TODO: res.json(result);
    } catch (e) {
      next(e);
    }
  },
);

// -----------------------
// GET /api/authors/:id
// -----------------------
/**
 * Get a single author by id.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - Extract the validated id using middleware.requireId
 * - If author not found: return 404
 * - Otherwise: return author as JSON
 */
router.get(
  "/:id",
  // TODO: attach validateResourceId middleware
  async (_req, res, next) => {
    try {
      // TODO: extract the validated id using middleware.requireId
      // TODO: await db.getAuthorById
      // TODO: if not found, return res.status(404).json({ error: "Author not found" });
      // TODO: res.json(author);
    } catch (e) {
      next(e);
    }
  },
);

// -----------------------
// POST /api/authors
// -----------------------
/**
 * Create a new author.
 *
 * Requirements:
 * - Validate request body using validateAuthorInput
 * - If validation errors exist: return 400 with error messages
 * - Call db.createAuthor
 * - Return 201 with created author
 */
router.post("/", async (req, res, next) => {
  try {
    // TODO: validate input using middleware.validateAuthorInput(req.body)
    // TODO: if errors exist, return 400 Validation Error
    // TODO: await db.createAuthor
    // TODO: return 201 with created author
  } catch (e) {
    next(e);
  }
});

// -----------------------
// PUT /api/authors/:id
// -----------------------
/**
 * Update an existing author.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - Validate request body
 * - If validation errors exist: return 400
 * - Call db.updateAuthor
 * - If author not found: return 404
 * - Otherwise: return updated author
 */
router.put(
  "/:id",
  // TODO: attach validateResourceId middleware
  async (req, res, next) => {
    try {
      // TODO: validate input
      // TODO: get authorId with middleware.requireId
      // TODO: const updated = await db.updateAuthor
      // TODO: if updated is null, return 404
      // TODO: return updated author
    } catch (e) {
      next(e);
    }
  },
);

// -----------------------
// DELETE /api/authors/:id
// -----------------------
/**
 * Delete an author.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - If author does not exist: return 404
 * - Enforce "only author" constraint:
 *   - If db.deleteAuthor throws a constraint error:
 *     return 400 with a Constraint Error message
 * - On success: return 204 No Content
 */
router.delete(
  "/:id",
  // TODO: attach validateResourceId middleware
  async (_req, res, next) => {
    try {
      // TODO: const authorId = middleware.requireId(res);

      // TODO: check author existence via db.getAuthorById
      //       if not found, return 404

      try {
        // TODO: await db.deleteAuthor
        // TODO: return 204 No Content
      } catch (e: unknown) {
        // TODO: detect "only author" constraint error
        // Hint: use isErrorWithMessage(e) and check e.message
        // If matched, return 400 with a Constraint Error
        throw e;
      }
    } catch (e) {
      next(e);
    }
  },
);

export default router;
