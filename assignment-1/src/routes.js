// This file defines API endpoints under /api.
//
// Your main job is to fill in the TODOs using functions from database.js,
// and return the correct status codes + JSON responses.

const express = require("express");
const router = express.Router();

const db = require("./database");
const {
	validatePaper,
	validateId,
	validateQueryParams,
} = require("./middleware");

// Helper function to convert papers date fields to ISO 8601
const toISODateTime = (paper) => {
	paper.created_at = paper.created_at.replace(" ", "T") + ".000Z";
	paper.updated_at = paper.updated_at.replace(" ", "T") + ".000Z";
};

// ------------------------------------------------------------
// GET /api/papers
//
// Supports optional query parameters:
// - year
// - published_in
// - limit
// - offset
//
// Query format validation is handled by validateQueryParams.
// ------------------------------------------------------------
router.get("/papers", validateQueryParams, async (req, res, next) => {
	try {
		const filters = {
			year: req.query.year || null,
			published_in: req.query.published_in || null,
			limit: req.query.limit || 10,
			offset: req.query.offset || 0,
		};

		const papers = await db.getAllPapers(filters);

		papers.forEach((element) => {
			toISODateTime(element);
		});

		res.status(200).json(papers);
	} catch (error) {
		// Forward unexpected errors to the error handler (500)
		next(error);
	}
});

// ------------------------------------------------------------
// GET /api/papers/:id
//
// validateId ensures :id is a valid positive integer.
// ------------------------------------------------------------
router.get("/papers/:id", validateId, async (req, res, next) => {
	try {
		const paper = await db.getPaperById(Number(req.params.id));
		if (!paper) {
			return res.status(404).json({ error: "Paper not found" });
		}

		toISODateTime(paper);
		res.status(200).json(paper);
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------------------------
// POST /api/papers
//
// Validates request body using validatePaper.
// ------------------------------------------------------------
router.post("/papers", async (req, res, next) => {
	try {
		const errors = validatePaper(req.body);
		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const paper = await db.createPaper(req.body);
		toISODateTime(paper);
		res.status(201).json(paper);
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------------------------
// PUT /api/papers/:id
//
// IMPORTANT:
// validateId runs BEFORE validatePaper.
// This ensures invalid ID format returns 400
// even if the request body is invalid.
// ------------------------------------------------------------
router.put("/papers/:id", validateId, async (req, res, next) => {
	try {
		const errors = validatePaper(req.body);
		if (errors.length > 0) {
			return res
				.status(400)
				.json({ error: "Validation Error", messages: errors });
		}

		const paperId = Number(req.params.id);
		const paper = await db.getPaperById(paperId);
		if (!paper) {
			return res.status(404).json({ error: "Paper not found" });
		}

		const newPaper = {
			...paper,
			...req.body,
		};

		const updatedPaper = await db.updatePaper(paperId, newPaper);
		toISODateTime(updatedPaper);
		res.status(200).json(updatedPaper);
	} catch (error) {
		next(error);
	}
});

// ------------------------------------------------------------
// DELETE /api/papers/:id
//
// validateId ensures :id is valid.
// ------------------------------------------------------------
router.delete("/papers/:id", validateId, async (req, res, next) => {
	try {
		const paper = await db.getPaperById(Number(req.params.id));
		if (!paper) {
			return res.status(404).json({ error: "Paper not found" });
		}

		await db.deletePaper(Number(req.params.id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

module.exports = router;
