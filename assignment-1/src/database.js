// This file handles all database-related logic using SQLite.
//
// You are responsible for:
// 1) Creating the `papers` table
// 2) Implementing the database operations below
//
// Do NOT handle HTTP status codes here.
// Do NOT perform request validation here.
// This layer should only deal with database operations.

const sqlite3 = require("sqlite3").verbose();

// ------------------------------------------------------------
// Connect to SQLite database
// ------------------------------------------------------------
const db = new sqlite3.Database("./paper_management.db", (err) => {
	if (err) {
		console.error("Error connecting to database:", err);
	} else {
		console.log("Connected to SQLite database");
	}
});

db.run(
	`
  CREATE TABLE IF NOT EXISTS papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    published_in TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year > 1900),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,
	(err) => {
		if (err) {
			console.error("Error creating table:", err);
		} else {
			console.log("papers table ready");
		}
	},
);

// ------------------------------------------------------------
// Database operations
//
// Each function should return a Promise (use async / await).
// Let errors propagate to the route layer.
// ------------------------------------------------------------
const dbOperations = {
	// ----------------------------------------------------------
	// createPaper
	//
	// Inserts a new paper into the database.
	//
	// Input:
	// - paper object with title, authors, published_in, year
	//
	// Output:
	// - the newly created paper (including id and timestamps)
	//
	// Hint:
	// - Use db.run() for INSERT
	// - Use `this.lastID` to get the inserted row ID
	// - After inserting, query the paper again by ID
	// ----------------------------------------------------------
	createPaper: async (paper) => {
		const paperId = await new Promise((resolve, reject) => {
			db.run(
				`
				INSERT INTO papers (title, authors, published_in, year)
				VALUES (?, ?, ?, ?)
				`,
				[paper.title, paper.authors, paper.published_in, paper.year],
				function (err) {
					if (err) reject(err);
					else resolve(this.lastID);
				},
			);
		});

		return await dbOperations.getPaperById(paperId);
	},

	// ----------------------------------------------------------
	// getAllPapers
	//
	// Retrieves all papers, optionally applying filters.
	//
	// Supported filters:
	// - year
	// - published_in (partial match, case-insensitive)
	// - limit
	// - offset
	//
	// Output:
	// - array of paper objects
	//
	// Hint:
	// - Start with: "SELECT * FROM papers"
	// - Dynamically add WHERE clauses if filters exist
	// - Use LIMIT and OFFSET at the end
	// - Use db.all() to retrieve multiple rows
	// ----------------------------------------------------------
	getAllPapers: async (filters = {}) => {
		const results = await new Promise((resolve, reject) => {
			let queryBuilder = ["SELECT * FROM papers WHERE 1=1"];
			let values = [];
			if (filters.year) {
				queryBuilder.push("AND year = ?");
				values.push(filters.year);
			}
			if (filters.published_in) {
				queryBuilder.push("AND LOWER(published_in) LIKE ?");
				values.push(`%${filters.published_in.toLowerCase()}%`);
			}
			if (filters.limit) {
				queryBuilder.push("LIMIT ?");
				values.push(filters.limit);
			}
			if (filters.offset) {
				queryBuilder.push("OFFSET ?");
				values.push(filters.offset);
			}
			const query = queryBuilder.join(" ");
			db.all(query, values, (err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			});
		});

		return results;
	},

	// ----------------------------------------------------------
	// getPaperById
	//
	// Retrieves a single paper by ID.
	//
	// Input:
	// - id (number)
	//
	// Output:
	// - paper object if found
	// - null / undefined if not found
	//
	// Hint:
	// - Use db.get()
	// ----------------------------------------------------------
	getPaperById: async (id) => {
		return await new Promise((resolve, reject) => {
			db.get("SELECT * FROM papers WHERE id = ?", [id], (err, row) => {
				if (err) reject(err);
				else resolve(row);
			});
		});
	},

	// ----------------------------------------------------------
	// updatePaper
	//
	// Updates an existing paper by ID.
	//
	// Input:
	// - id (number)
	// - paper object with updated fields
	//
	// Output:
	// - updated paper object if successful
	// - null / undefined if paper does not exist
	//
	// Hint:
	// - Use db.run() for UPDATE
	// - Update `updated_at` using CURRENT_TIMESTAMP
	// - After updating, query the paper again by ID
	// ----------------------------------------------------------
	updatePaper: async (id, paper) => {
		await new Promise((resolve, reject) => {
			db.run(
				`
				UPDATE papers SET title = ?, authors = ?, published_in = ?, year = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
				`,
				[
					paper.title,
					paper.authors,
					paper.published_in,
					paper.year,
					id,
				],
				function (err) {
					if (err) reject(err);
					else resolve();
				},
			);
		});

		return await dbOperations.getPaperById(id);
	},

	// ----------------------------------------------------------
	// deletePaper
	//
	// Deletes a paper by ID.
	//
	// Input:
	// - id (number)
	//
	// Output:
	// - no return value needed
	//
	// Hint:
	// - Use db.run() for DELETE
	// ----------------------------------------------------------
	deletePaper: async (id) => {
		return await new Promise((resolve, reject) => {
			db.run("DELETE FROM papers WHERE id = ?", [id], function (err) {
				if (err) reject(err);
				else resolve();
			});
		});
	},
};

// ------------------------------------------------------------
// Exports
// ------------------------------------------------------------
module.exports = {
	db, // export the database instance (used by tests)
	...dbOperations, // export all database functions
};
