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
	middleware.validateAuthorQueryParams,
	async (req, res, next) => {
		try {
			const { authorQuery } = res.locals as ValidatedLocals;

			const filters = {
				name: authorQuery?.name,
				affiliation: authorQuery?.affiliation,
				limit: authorQuery?.limit || 10,
				offset: authorQuery?.offset || 0,
			};

			const authors = await db.getAllAuthors(filters);

			res.json(authors);
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
router.get("/:id", middleware.validateResourceId, async (_req, res, next) => {
	try {
		const id = middleware.requireId(res);

		const author = await db.getAuthorById(id);

		if (!author) {
			return res.status(404).json({ error: "Author not found" });
		}

		res.json(author);
	} catch (e) {
		next(e);
	}
});

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
		const errors = middleware.validateAuthorInput(req.body);

		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const author = await db.createAuthor(req.body);

		res.status(201).json(author);
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
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
	try {
		const errors = middleware.validateAuthorInput(req.body);

		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const authorId = middleware.requireId(res);

		const updated = await db.updateAuthor(authorId, req.body);

		if (!updated) {
			return res.status(404).json({ error: "Author not found" });
		}

		res.json(updated);
	} catch (e) {
		next(e);
	}
});

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

	middleware.validateResourceId,
	async (_req, res, next) => {
		try {
			const authorId = middleware.requireId(res);

			const author = await db.getAuthorById(authorId);

			if (!author) {
				return res.status(404).json({ error: "Author not found" });
			}

			try {
				await db.deleteAuthor(authorId);

				res.status(204).send();
			} catch (e: unknown) {
				if (
					isErrorWithMessage(e) &&
					e.message.includes("only author")
				) {
					return res.status(400).json({
						error: "Constraint Error",
						message: e.message,
					});
				}
				throw e;
			}
		} catch (e) {
			next(e);
		}
	},
);

export default router;
