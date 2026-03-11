## Q1: Before coding, what did you think would be the hardest part?

I think the hardest part will be defining and using server actions to create a paper or author because I am not familiar with the concept or workflow. I think the tricky part might be figuring out the asynchronous stuff (e.g. when do I call await) inside the body of my action and when I am calling the action.

## Q2: Did you use AI?

- If YES: list the files or functions that were affected.
- If NO: write “No AI used” and briefly describe your approach or one challenge you encountered (1–2 sentences).

No AI used, like last assignment, whenever I was confused on how to implement a function, I would reference the lecture slides, official developer docs, and stack overflow posts. For this assignment in particular. I found that the error handling of the actions was the hardest part to implement, because I wasn't sure how to pass on the error message to CreatePaperForm which calls the createPaper action (typescript didn't allow me to just do error.message). I had to search through the Mozilla developer docs until I came across an example on this [page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) that introduced me to instanceof which solved my problem.

## Q3: (Only if you used AI) Choose one AI-generated output and explain what you changed and why.
