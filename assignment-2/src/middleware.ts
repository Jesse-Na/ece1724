// This file contains Express middleware functions.
//
// You DO NOT need to modify requestLogger or errorHandler.
// Your task is to implement:
//   - validatePaperInput
//   - validateAuthorInput
//   - validateResourceId
//   - validatePaperQueryParams
//   - validateAuthorQueryParams

import type { NextFunction, Request, Response } from "express";
import type {
  AuthorBody,
  PaperBody,
  ValidatedAuthorQuery,
  ValidatedLocals,
  ValidatedPaperQuery,
} from "./types";

// -----------------------
// Request logger middleware
// -----------------------
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// -----------------------
// Error handler middleware
// -----------------------
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  // If a response has already been sent, let Express handle it
  if (res.headersSent) return next(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

// -----------------------
// validatePaperInput
// -----------------------
/**
 * Middleware: Validate a paper object from the request body.
 *
 * Return value:
 * - Return an array of error messages (strings).
 * - Return [] if there are no validation errors.
 *
 * See handout for requirements to validate:
 * - title: required, must be a non-empty string
 * - publishedIn: required, must be a non-empty string
 * - year: required, must be an integer > 1900
 * - authors: required, must be a non-empty array
 *   - each author must have a valid name
 */
export const validatePaperInput = (paper: PaperBody): string[] => {
  const errors: string[] = [];

  // TODO: validate paper.title

  // TODO: validate paper.publishedIn

  // TODO: validate paper.year

  // TODO: validate paper.authors exists and is a non-empty array

  // TODO: validate each author has a valid name
  if (
    paper.title === undefined ||
    paper.title === null ||
    paper.title.trim() === ""
  ) {
    errors.push("Title is required");
  }

  if (
    paper.authors === undefined ||
    paper.authors === null ||
    paper.authors.length === 0
  ) {
    errors.push("At least one author is required");
  } else {
    for (let i = 0; i < paper.authors.length; i++) {
      const author = paper.authors[i];
      if (
        author.name === undefined ||
        author.name === null ||
        author.name.trim() === ""
      ) {
        errors.push("Author name is required");
        break;
      }
    }
  }

  if (
    paper.publishedIn === undefined ||
    paper.publishedIn === null ||
    paper.publishedIn.trim() === ""
  ) {
    errors.push("Published venue is required");
  }

  if (paper.year === undefined || paper.year === null) {
    errors.push("Published year is required");
  } else {
    const year = paper.year;
    if (isNaN(year) || !Number.isInteger(year) || year <= 1900) {
      errors.push("Valid year after 1900 is required");
    }
  }

  return errors;
};

// -----------------------
// validateAuthorInput
// -----------------------
/**
 * Middleware: validate an author object from the request body.
 *
 * Return value:
 * - Return an array of error messages (strings).
 * - Return [] if there are no validation errors.
 *
 * Requirements to validate (see handout):
 * - name: required, must be a non-empty string
 */
export const validateAuthorInput = (author: AuthorBody): string[] => {
  const errors: string[] = [];

  // TODO: validate author.name

  return errors;
};

// -----------------------
// validateResourceId
// -----------------------
/**
 * Middleware: validate `:id` route parameter.
 *
 * Requirements:
 * - ID must be a positive integer
 * - On invalid ID: respond with HTTP 400 and a JSON validation error
 * - On valid ID:
 *   - parse it as a number
 *   - store it into res.locals.id
 *   - call next()
 */
export const validateResourceId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO: read the raw id from req.params.id as a string
  const id = Number(req.params.id as string);
  // TODO: validate it is a positive integer
  if (isNaN(id) || !Number.isInteger(id) || Number(id) <= 0) {
    return res
      .status(400)
      .json({ error: "Validation Error", message: "Invalid ID format" });
  }
  // TODO: if invalid, return res.status(400).json({ error: ..., message: ... })

  // TODO: convert to number

  // TODO: store validated id into res.locals.id (use type ValidatedLocals)
  res.locals.id = id;

  // TODO: next();
  next();
};

// -----------------------
// Helper: requireId (provided)
// -----------------------
/**
 * Extracts a validated numeric `id` from `res.locals`.
 *
 * This function assumes that the `validateResourceId` middleware
 * has already run and stored a parsed number in `res.locals.id`.
 *
 * This function can be used in `src/routes/papers.ts` and
 * `src/routes/authors.ts`
 *
 * Why do we need this helper?
 * - It avoids using the non-null assertion operator (`!`),
 *   which is forbidden by strict ESLint rules.
 * - It centralizes the runtime check in one place instead of
 *   repeating it in every route handler.
 *
 * If this function throws, it indicates a programming error
 * (the route forgot to attach `validateResourceId` middleware),
 * not a client error.
 */
export function requireId(res: Response): number {
  const { id } = res.locals as ValidatedLocals;
  if (typeof id !== "number") {
    throw new Error("validateResourceId middleware was not applied");
  }
  return id;
}

// -----------------------
// validatePaperQueryParams
// -----------------------
/**
 * Middleware: validate and parse query params for GET /api/papers
 *
 * Requirements (see handout):
 * - year (optional): must be an integer > 1900
 * - publishedIn (optional): string
 * - limit (optional): positive integer within range [1..100]
 * - offset (optional): non-negative integer
 *
 * On success:
 * - store the parsed result object in res.locals.paperQuery
 * - call next()
 *
 * On invalid query format:
 * - respond with HTTP 400 and a JSON validation error
 */
export const validatePaperQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed: ValidatedPaperQuery = {};

    const params = req.query;
    // TODO: validate year (if provided)
    if (params.year !== undefined) {
      const year = Number(params.year);
      if (isNaN(year) || !Number.isInteger(year) || year <= 1900) {
        throw new Error();
      }

      parsed.year = year;
    }

    // TODO: validate publishedIn (if provided)
    if (params.publishedIn !== undefined) {
      parsed.publishedIn = params.publishedIn as string;
    }

    // TODO: validate limit (if provided)
    if (params.limit !== undefined) {
      const limit = Number(params.limit);
      if (
        isNaN(limit) ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        throw new Error();
      }

      parsed.limit = limit;
    }

    // TODO: validate offset (if provided)
    if (params.offset !== undefined) {
      const offset = Number(params.offset);
      if (isNaN(offset) || !Number.isInteger(offset) || offset < 0) {
        throw new Error();
      }

      parsed.offset = offset;
    }

    // TODO: store parsed into res.locals.paperQuery
    res.locals.paperQuery = parsed;

    next();
  } catch {
    // TODO: respond with HTTP 400 and a JSON validation error
    res.status(400).json({
      error: "Validation Error",
      message: "Invalid query parameter format",
    });
  }
};

// -----------------------
// validateAuthorQueryParams
// -----------------------
/**
 * Middleware: validate and parse query params for GET /api/authors
 *
 * Requirements (see handout):
 * - name (optional): string
 * - affiliation (optional): string
 * - limit (optional): positive integer within range [1..100]
 * - offset (optional): non-negative integer
 *
 * On success:
 * - store the parsed result object in res.locals.authorQuery
 * - call next()
 *
 * On invalid query format:
 * - respond with HTTP 400 and a JSON validation error
 */
export const validateAuthorQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed: ValidatedAuthorQuery = {};

    // TODO: validate name (if provided)

    // TODO: validate affiliation (if provided)

    // TODO: validate limit (if provided)

    // TODO: validate offset (if provided)

    // TODO: store parsed into res.locals.authorQuery

    next();
  } catch {
    // TODO: respond with HTTP 400 and a JSON validation error
  }
};
