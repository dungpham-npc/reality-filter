---
title: Code Is a Long-Term Liability
summary: Every line of code you write is a future maintenance burden. The best engineers write less code, not more.
category: mental-shift
---

## The Uncomfortable Truth

Code is not an asset. Code is a liability.

Every line you write must be:
- Read and understood by future humans (including your future self)
- Tested against changing requirements
- Updated when dependencies shift
- Debugged when it interacts poorly with other code

The more code you write, the more surface area you create for bugs, misunderstandings, and maintenance costs.

## The Cost of Change

Google's internal research (documented in *Software Engineering at Google*) found that the cost of maintaining code over its lifetime dwarfs the cost of writing it initially. A rough ratio:

| Activity | Relative Cost |
|---|---|
| Writing initial code | 1x |
| Understanding existing code | 3-5x |
| Modifying existing code safely | 5-10x |
| Debugging subtle interactions | 10-50x |

> "Software engineering is programming integrated over time."
>
> — Titus Winters, *Software Engineering at Google*

## What This Means for You

The bank account code you wrote was short and clean. But it encoded wrong assumptions. Now imagine that code living in a system for five years, with dozens of developers building on top of it, none of whom know about the concurrency bug. One day, under real load, money starts disappearing.

The cost is not the 20 lines you wrote. The cost is the *years* of false confidence those 20 lines created.

## Further Reading

- *Software Engineering at Google* — Chapter 1: "What is Software Engineering?" (the time dimension)
- Real-world postmortems from [Google's SRE Book](https://sre.google/sre-book/table-of-contents/) — Notice how small root causes cascade into massive impact
