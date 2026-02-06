import { Router } from "express";
import paperRoutes from "./routes/papers";
import authorRoutes from "./routes/authors";

const router = Router();

/**
 * This is the main router file that combines all route modules.
 *
 * How it is used:
 * - server.ts mounts this router at "/api"
 *   app.use("/api", routes);
 *
 * Your task:
 * - Connect the route modules so that:
 *   - /api/papers/* requests are handled by routes/papers.ts
 *   - /api/authors/* requests are handled by routes/authors.ts
 *
 * Examples (after wiring is complete):
 * - GET /api/papers/1   → handled by routes/papers.ts (GET "/:id")
 * - GET /api/authors/1  → handled by routes/authors.ts (GET "/:id")
 */

router.use("/papers", paperRoutes);

router.use("/authors", authorRoutes);

export default router;
