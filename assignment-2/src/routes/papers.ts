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
router.get(
  "/",
  // TODO: attach validatePaperQueryParams middleware
  middleware.validatePaperQueryParams,
  async (req, res, next) => {
    try {
      // TODO: read validated query params from res.locals
      const { paperQuery } = res.locals as ValidatedLocals;
      // TODO: apply defaults for limit and offset
      const filters = {
        year: paperQuery?.year,
        publishedIn: paperQuery?.publishedIn,
        limit: paperQuery?.limit || 10,
        offset: paperQuery?.offset || 0,
      };
      // TODO: call db.getAllPapers
      const papers = await db.getAllPapers(filters);
      // TODO: res.json(result);
      res.json(papers);
    } catch (e) {
      next(e);
    }
  },
);

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
router.get(
  "/:id",
  // TODO: attach validateResourceId middleware
  middleware.validateResourceId,
  async (_req, res, next) => {
    try {
      // TODO: use middleware.requireId(res);
      const id = middleware.requireId(res);
      // TODO: await db.getPaperById
      const paper = await db.getPaperById(id);
      // TODO: if not found, return 404
      if (!paper) res.status(404).json({ error: "Paper not found" });
      // TODO: res.json(paper);
      res.json(paper);
    } catch (e) {
      next(e);
    }
  },
);

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
    // TODO: validate input using middleware.validatePaperInput(req.body)
    const errors = middleware.validatePaperInput(req.body);
    // TODO: if errors exist, return 400 Validation Error
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }
    // TODO:await db.createPaper
    const paper = await db.createPaper(req.body);
    // TODO: return 201 with created paper
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
router.put(
  "/:id",
  // TODO: attach validateResourceId middleware
  async (req, res, next) => {
    try {
      // TODO: validate input
      // TODO: use middleware.requireId(res)
      // TODO: const updated = await db.updatePaper
      // TODO: if updated is null, return 404
      // TODO: return updated paper
    } catch (e) {
      next(e);
    }
  },
);

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
  async (_req, res, next) => {
    try {
      // TODO: use middleware.requireId
      // TODO: check existence via db.getPaperById
      //       if not found, return 404
      // TODO: await db.deletePaper
      // TODO: return 204 No Content
    } catch (e) {
      next(e);
    }
  },
);

export default router;
