## Q1: Before coding, what did you think would be the hardest part?

I think the hardest part will be figuring out how to implement `routes`, specifically the request logic sent to the backend. For example, just from looking at the descriptions, I don't quite understand what it's saying when it talks about additional steps we must take when creating or updating a paper. This part also seems the most prone to miscellaneous errors, possibly due to my database configuration or something with Vite.

## Q2: Did you use AI?

- If YES: list the files or functions that were affected.
- If NO: write “No AI used” and briefly describe your approach or one challenge you encountered (1–2 sentences).

No AI used, like last assignment, whenever I was confused on how to implement a function, I would reference the lecture slides, official developer docs, and stack overflow posts. For this assignment in particular, I went to mozilla's developer docs for help with Javascript functions like `fetch` and when working with HTML form objects.
I found that implementing the `PaperForm` component was the hardest since I had some confusion on how to validate a missing publication year, which I got an answer to on GitHub discussions, and I was also confused as to how the logic was supposed to work. For example, why was there a paper prop if I'm creating a new paper with `formData`? It took me a bit to understand that this was a component that had two modes to it, but once I understood that aspect, the form validation and handle change functions now made sense.

## Q3: (Only if you used AI) Choose one AI-generated output and explain what you changed and why.
