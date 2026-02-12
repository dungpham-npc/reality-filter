---
title: Think Failure-First Without Becoming Scared
summary: The best engineers obsess over how things break — not because they're pessimists, but because understanding failure is the only path to building reliable systems.
category: mental-shift
---

## The Paradox

Beginners think about the happy path: "How do I make this work?"

Experienced engineers think about failure: "How will this break?"

This isn't pessimism. It's the only way to build systems that survive contact with reality. But there's a crucial distinction — thinking about failure should make you *more confident*, not paralyzed.

## Real Failures, Real Scale

Consider these actual incidents:

**Cloudflare (2019):** A single misconfigured regular expression in a WAF rule caused a global outage. CPU usage hit 100% across all edge servers simultaneously. The root cause? A regex with catastrophic backtracking — `.*.*=.*` — that looked perfectly innocent.

**AWS S3 (2017):** A typo in a command intended to remove a small number of servers accidentally removed a much larger set of servers that supported critical S3 subsystems. Result: A significant portion of the internet went down for hours.

**Stripe (2019):** A database migration that had been tested extensively in staging behaved differently in production due to a subtle difference in data distribution. The failure mode? Silent data corruption that wasn't detected for hours.

## The Pattern

Every one of these failures shares a common structure:

1. The system *looked* correct under normal conditions
2. The failure was triggered by conditions that seemed unlikely or were invisible
3. The root cause was a broken assumption, not a broken algorithm
4. The impact was disproportionate to the cause

Sound familiar? Your bank account code followed the same pattern exactly.

## The Mindset

Failure-first thinking means asking:
- "What happens if two requests arrive at the same time?"
- "What if this number is negative? Zero? Extremely large?"
- "What if the network drops halfway through?"
- "What assumptions am I making about ordering, timing, uniqueness?"

## Further Reading

- Cloudflare, AWS, and Stripe incident postmortems (publicly available)
- Martin Kleppmann, *Designing Data-Intensive Applications* — Chapters 7-9 on transactions, consistency, and what can go wrong
- [How Complex Systems Fail](https://how.complexsystems.fail/) — Richard Cook's 18 short theses
