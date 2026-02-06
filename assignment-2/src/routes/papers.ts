import { Router } from "express";
import { db } from "../database";
import * as middleware from "../middleware";
import type { ValidatedLocals } from "../types";

const router = Router();

// -----------------------
// GET /api/papers
// -----------------------
/**
 * List papers with optional query parameters.
 *
 * Requirements:
 * - Apply validatePaperQueryParams middleware
 * - Support optional query params:
 *   - year
 *   - publishedIn
 *   - limit (default 10)
 *   - offset (default 0)
 * - Call db.getAllPapers(...) with parsed values
 * - Return the result as JSON
 */
router.get("/", middleware.validatePaperQueryParams, async (req, res, next) => {
	try {
		const { paperQuery } = res.locals as ValidatedLocals;

		const filters = {
			year: paperQuery?.year,
			publishedIn: paperQuery?.publishedIn,
			limit: paperQuery?.limit || 10,
			offset: paperQuery?.offset || 0,
		};

		const papers = await db.getAllPapers(filters);

		res.json(papers);
	} catch (e) {
		next(e);
	}
});

// -----------------------
// GET /api/papers/:id
// -----------------------
/**
 * Get a single paper by id.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - Extract validated id using middleware.requireId
 * - If paper not found: return 404
 * - Otherwise: return paper as JSON
 */
router.get("/:id", middleware.validateResourceId, async (_req, res, next) => {
	try {
		const id = middleware.requireId(res);

		const paper = await db.getPaperById(id);

		if (!paper) res.status(404).json({ error: "Paper not found" });

		res.json(paper);
	} catch (e) {
		next(e);
	}
});

// -----------------------
// POST /api/papers
// -----------------------
/**
 * Create a new paper.
 *
 * Requirements:
 * - Validate request body using validatePaperInput
 * - If validation errors exist: return 400 with error messages
 * - Call db.createPaper
 * - Return 201 with created paper
 */
router.post("/", async (req, res, next) => {
	try {
		const errors = middleware.validatePaperInput(req.body);

		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const paper = await db.createPaper(req.body);

		res.status(201).json(paper);
	} catch (e) {
		next(e);
	}
});

// -----------------------
// PUT /api/papers/:id
// -----------------------
/**
 * Update an existing paper.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - Validate request body
 * - If validation errors exist: return 400
 * - Call db.updatePaper
 * - If paper not found: return 404
 * - Otherwise: return updated paper
 */
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
	try {
		const errors = middleware.validatePaperInput(req.body);
		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const id = middleware.requireId(res);

		const updated = await db.updatePaper(id, req.body);

		if (!updated) {
			return res.status(404).json({ error: "Paper not found" });
		}

		res.json(updated);
	} catch (e) {
		next(e);
	}
});

// -----------------------
// DELETE /api/papers/:id
// -----------------------
/**
 * Delete a paper.
 *
 * Requirements:
 * - Apply validateResourceId middleware
 * - If paper does not exist: return 404
 * - Otherwise: delete and return 204 No Content
 */
router.delete(
	"/:id",
	// TODO: attach validateResourceId middleware
	middleware.validateResourceId,
	async (_req, res, next) => {
		try {
			const id = middleware.requireId(res);

			const paper = await db.getPaperById(id);
			if (!paper) {
				return res.status(404).json({ error: "Paper not found" });
			}

			await db.deletePaper(id);

			res.status(204).end();
		} catch (e) {
			next(e);
		}
	},
);

export default router;
