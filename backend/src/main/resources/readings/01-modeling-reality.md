---
title: Modeling Reality Is the Real Progress
summary: The hardest part of software is not writing code — it's building an accurate model of the messy, contradictory reality you're trying to represent.
category: mental-shift
---

## The Illusion

Most beginners measure progress by lines of code written, features shipped, or tutorials completed. The feeling of typing fluently creates a convincing illusion of competence.

But software that doesn't model reality correctly is just sophisticated nonsense that happens to compile.

## What Actually Matters

Real software engineering progress looks like this:

- You spend an hour staring at a whiteboard, and at the end you have *three sentences* describing what the system must guarantee.
- You delete code because you realized the abstraction was wrong.
- You rewrite a data model for the third time because the business rule changed — and you understand *why* each previous version was subtly broken.

> "The purpose of software engineering is not to produce code. It is to produce a correct model of reality that happens to be executable."
>
> — paraphrased from John Ousterhout, *A Philosophy of Software Design*

## The Real Skill

The bank account task you just attempted is a microcosm. The code *looked* right. It *felt* right. The tests passed. But the model was wrong — it assumed atomicity where none existed.

This is what the field demands, constantly:

- **Discovering invariants** — What must always be true, no matter what?
- **Questioning assumptions** — What am I taking for granted about how this executes?
- **Modeling change** — How does this break when reality shifts?

## Further Reading

- John Ousterhout, *A Philosophy of Software Design* — Chapters 1-3 on complexity and abstraction
- Problem-statement-heavy RFCs (e.g., Kubernetes KEPs, Rust RFCs) — Notice how much text is spent on *defining the problem* vs. *proposing solutions*
