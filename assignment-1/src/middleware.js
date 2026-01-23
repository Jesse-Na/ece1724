// This file contains Express middleware functions used by the server.
//
// You DO NOT need to modify requestLogger or errorHandler.
// Your task is to implement:
//   - validatePaper
//   - validateId
//   - validateQueryParams

// ------------------------------------------------------------
// Request logger middleware
// Logs each incoming request (for debugging / visibility)
// ------------------------------------------------------------
const requestLogger = (req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
};

// ------------------------------------------------------------
// Error handler middleware (unexpected failures only)
//
// This middleware is a safety net for unexpected server errors
// (e.g. database errors or runtime exceptions).
//
// You do NOT need to trigger or handle 500 errors explicitly
// in this assignment. If something unexpected goes wrong,
// this middleware ensures the server returns a JSON error
// instead of crashing.
// ------------------------------------------------------------
const errorHandler = (err, req, res, next) => {
	console.error(err);

	// If a response has already been sent, let Express handle it
	if (res.headersSent) return next(err);

	return res.status(500).json({ error: "Internal Server Error" });
};

// ------------------------------------------------------------
// validatePaper
//
// Validates the request body for POST / PUT requests.
//
// Return value:
// - An array of error messages
// - Empty array [] means validation passed
//
// Required fields:
// - title: non-empty string
// - authors: non-empty string
// - published_in: non-empty string
// - year: integer greater than 1900
//
// Error message strings MUST match the handout exactly.
// ------------------------------------------------------------
const validatePaper = (paper) => {
	const errors = [];
	if (
		paper.title === undefined ||
		paper.title === null ||
		paper.title.toString().trim() === ""
	) {
		errors.push("Title is required");
	}

	if (
		paper.authors === undefined ||
		paper.authors === null ||
		paper.authors.toString().trim() === ""
	) {
		errors.push("Authors are required");
	}

	if (
		paper.published_in === undefined ||
		paper.published_in === null ||
		paper.published_in.toString().trim() === ""
	) {
		errors.push("Published venue is required");
	}

	if (paper.year === undefined || paper.year === null || paper.year === "") {
		errors.push("Published year is required");
	} else {
		const year = Number(paper.year);
		if (!Number.isInteger(year) || year <= 1900) {
			errors.push("Valid year after 1900 is required");
		}
	}

	return errors;
};

// ------------------------------------------------------------
// validateId
//
// Middleware to validate :id route parameter.
//
// If the ID is invalid:
// - Respond immediately with status 400
// - Do NOT call next()
//
// Error response format:
// {
//   "error": "Validation Error",
//   "message": "Invalid ID format"
// }
//
// If valid, call next() to continue.
// ------------------------------------------------------------
const validateId = (req, res, next) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		return res
			.status(400)
			.json({ error: "Validation Error", message: "Invalid ID format" });
	}

	next();
};

// ------------------------------------------------------------
// validateQueryParams
//
// Middleware to validate query parameters for GET /api/papers.
//
// Supported query parameters:
// - year   (integer > 1900)
// - limit  (integer between 1 and 100)
// - offset (integer >= 0)
//
// If any query parameter is invalid:
// - Respond with status 400
// - Do NOT call next()
//
// Error response format:
// {
//   "error": "Validation Error",
//   "message": "Invalid query parameter format"
// }
//
// If all parameters are valid, call next().
// ------------------------------------------------------------
const validateQueryParams = (req, res, next) => {
	const error = {
		error: "Validation Error",
		message: "Invalid query parameter format",
	};
	const params = req.query;
	if (params.year !== undefined) {
		const year = Number(params.year);
		if (!Number.isInteger(year) || year <= 1900) {
			return res.status(400).json(error);
		}
	}

	if (params.limit !== undefined) {
		const limit = Number(params.limit);
		if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
			return res.status(400).json(error);
		}
	}

	if (params.offset !== undefined) {
		const offset = Number(params.offset);
		if (!Number.isInteger(offset) || offset < 0) {
			return res.status(400).json(error);
		}
	}

	next();
};

module.exports = {
	requestLogger,
	errorHandler,
	validatePaper,
	validateId,
	validateQueryParams,
};
