## Q1: Before coding, what did you think would be the hardest part?

I thought the hardest part would be figuring out all the types (e.g. PaperCreateData, ValidatedPaperQuery, etc.)
since the implementation seems to have many different types for the Paper table used by different parts of the app
(e.g. database.ts, papers.ts, middleware.ts, etc.). Getting them all correct seemed to be a lot of reading and
thinking about the code structure.

## Q2: Did you use AI?

- If YES: list the files or functions that were affected.
- If NO: write “No AI used” and briefly describe your approach or one challenge you encountered (1–2 sentences).

No AI used, like last assignment, whenever I was confused on how to implement a function, I would reference the lecture slides, official developer docs, and stack overflow posts. For this assignment in particular, typescript made it very easy
for me to also guess as to what I should pass into function calls like when I made ORM calls using `prisma.paper.findMany`.
The hints and comments in the code also helped a lot. I found that implementing the first function (I chose to do the
create paper endpoint) was the hardest since I had to figure out all the types, code the middleware, database helpers, etc., but after I got the first one down, everything else became much faster. `getAllPapers` was also a bit of a slowdown, but again, after finishing that function `getAllAuthors` was very easy.

## Q3: (Only if you used AI) Choose one AI-generated output and explain what you changed and why.
