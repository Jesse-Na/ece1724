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
		res.status(200).json(papers);

		// TODO:
		// - Call the database function to retrieve papers
		// - Return the result as JSON
		// - Status code: 200
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
		// TODO:
		// - Retrieve the paper by ID
		// - If not found, return:
		//     Status: 404
		//     { "error": "Paper not found" }
		// - If found, return the paper as JSON
		// - Status code: 200
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
			// TODO:
			// - Return status 400 with validation error information
		}

		// TODO:
		// - Create a new paper using the database
		// - Return the created paper as JSON
		// - Status code: 201
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
			// TODO:
			// - Return status 400 with validation error information
		}

		// TODO:
		// - Update the paper with the given ID
		// - If the paper does not exist, return:
		//     Status: 404
		//     { "error": "Paper not found" }
		// - If updated, return the updated paper as JSON
		// - Status code: 200
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
		// TODO:
		// - Check whether the paper exists
		// - If not found, return:
		//     Status: 404
		//     { "error": "Paper not found" }
		// - If found, delete it
		// - Return status 204 with an empty body
	} catch (error) {
		next(error);
	}
});

module.exports = router;
