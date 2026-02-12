---
title: "This Feels Too Easy" Is a Warning Signal
summary: If a software problem feels straightforward, you're almost certainly missing something. Comfort is not the same as correctness.
category: mental-shift
---

## The Trap

When a problem feels easy, most people feel good. They write code quickly, tests pass, and they move on.

But in real software engineering, "this feels easy" is one of the most dangerous signals you can experience. It almost always means one of:

1. **You don't understand the problem well enough** — The real complexity is hidden
2. **You're solving the wrong problem** — Your model of what's needed is incomplete
3. **The failure modes are invisible to you** — Your tests are testing the wrong things
4. **You're confusing familiarity with understanding** — You've seen something *similar* but the differences matter

## The Bank Account Example

The task felt easy because:
- You've seen "bank account" as a textbook example many times
- The API surface is small (deposit, withdraw, transfer, getBalance)
- The logic is "obviously" simple arithmetic
- The tests confirmed your intuition

Every one of these comfort signals was misleading. The problem wasn't arithmetic — it was *concurrency and invariant preservation*. But nothing in the "easy" framing prompted you to think about that.

## A Calibration Heuristic

When you encounter a problem in real software work, try this:

| Your Feeling | What It Probably Means |
|---|---|
| "This is trivial" | You're missing at least one critical constraint |
| "I've done this before" | The differences from last time will bite you |
| "The tests pass" | Your tests share your blind spots |
| "I can't think of edge cases" | You haven't thought hard enough |
| "This is uncomfortably hard" | You might actually be engaging with the real problem |

Discomfort is not a sign of incompetence. It's a sign that you're close to the real complexity.

## Further Reading

- Dense, slightly uncomfortable technical writing that doesn't hand-hold — practice sitting with material you don't immediately understand
- Fred Brooks, *No Silver Bullet* — on essential vs. accidental complexity
- Rich Hickey, *Simple Made Easy* (talk) — on the difference between "easy" and "simple" (they are not the same)
