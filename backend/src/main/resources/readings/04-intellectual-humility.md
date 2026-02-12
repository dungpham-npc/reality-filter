---
title: Intellectual Humility and Restraint
summary: The urge to build quickly and cleverly is the enemy of correctness. The best engineers move slowly and doubt their own assumptions.
category: mental-shift
---

## The Temptation

There is a deep satisfaction in writing code quickly. Seeing tests pass feels like validation. Finishing early feels like competence.

But speed without understanding is just confident wrongness.

## Dijkstra's Warning

Edsger Dijkstra, one of the founding thinkers of computer science, spent his career arguing that **programming is too hard for programmers.** Not because programmers are stupid — but because the gap between what we can hold in our heads and the complexity of what we're building is enormous and growing.

> "The competent programmer is fully aware of the strictly limited size of his own skull; he therefore approaches the programming task in full humility."
>
> — Edsger W. Dijkstra, *The Humble Programmer* (1972)

This isn't false modesty. It's a survival strategy. The moment you think you understand a system completely is the moment you stop looking for the bugs that will cost you.

## What Restraint Looks Like

- **Not** adding a feature until you understand why it's needed
- **Not** optimizing until you've measured
- **Not** assuming your mental model is correct just because the tests pass
- **Stopping** to ask: "What am I not seeing?"

Your bank account code was a perfectly reasonable implementation. The problem wasn't that you were careless — it was that you were *confidently correct* about something that required more scrutiny.

## The Uncomfortable Implication

Most programming education rewards speed and output. Real engineering rewards restraint and precision. These are not the same skill, and the first can actively interfere with the second.

## Further Reading

- Edsger W. Dijkstra, *The Humble Programmer* (EWD340) — [available online](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html)
- Edsger W. Dijkstra, *On the Cruelty of Really Teaching Computing Science* (EWD1036)
- Leslie Lamport, *Who Builds a House Without Drawing Blueprints?* — on the necessity of formal thinking before coding
