# ConsensusFlow

> **Trust what is true. With proof.**

ConsensusFlow is an open, evidence-first platform for building a transparent
**Global Consensus Score** for any claim. Voters link evidence, reputation
weights their votes, and the math is fully public and auditable.

🔗 **Website:** https://consensusflow.app
📖 **Methodology:** [docs/methodology.md](./docs/methodology.md)
🛣️ **Roadmap:** [docs/roadmap.md](./docs/roadmap.md)
📜 **License:** [MPL-2.0](./LICENSE)

---

## Why

Misinformation spreads faster than corrections. Wikipedia is great but opaque
and slow. Twitter is fast but un-cited. Stack Overflow has reputation but
cares about code, not truth.

ConsensusFlow sits in the middle: **cite your sources, weight by reputation,
publish the math.** Anyone can audit any score.

## Highlights

- 🧾 **Evidence-first** — you can't vote on a claim without citing a source
- ⚖️ **Reputation-weighted** — a domain expert's vote counts more in their field
- 🔬 **Transparent math** — the full algorithm is in this repo
- 🕒 **Time-aware** — newer evidence weighs more; old claims get re-evaluated
- 🛡️ **Sybil-resistant** — by design, not by afterthought
- 📱 **Web + mobile** — same backend, two clients
- 🌍 **Open source** — MPL-2.0, self-hostable, data export built in

## Quick start

Requires **Bun ≥ 1.3** and **Node ≥ 20**.

```bash
# 1. Install
bun install

# 2. Set up env
cp .env.example .env
# fill in DATABASE_URL (Neon) and RESEND_API_KEY

# 3. Push schema
bun db:push

# 4. (Optional) seed demo data
bun db:seed

# 5. Run everything
bun dev
```

- **Web:** http://localhost:3000
- **Mobile:** http://localhost:4000 (then scan with Expo Go)

## Architecture

Turborepo monorepo with shared TypeScript packages:

```
apps/
  web/            Next.js 16 + React 19 (Tailwind, Radix, shadcn/ui)
  mobile/         Expo SDK 54 + expo-router

packages/
  consensusflow/  DB schema, types, scoring, utils (the core)
  ui/             Shared web components
  mobile-package/ Shared mobile hooks / components
  eslint-config/  Shared ESLint config
  typescript-config/
```

## How a consensus score is computed

For a full explanation, see [docs/methodology.md](./docs/methodology.md).
Short version:

```
weight(user, claim) =
    user.reputation
  × user.domain_reputation_in_claim.category
  × time_decay(now - claim.created_at)
  × sybil_penalty(user)

consensus(claim) =
    Σ weight × vote_value
  / Σ weight
```

Where `vote_value` is `+1` (True), `+0.3` (Misleading), `0` (Unverified),
or `-1` (False).

## Project status

🟢 **Actively developed.** MVP in progress.

See [docs/roadmap.md](./docs/roadmap.md) for what's shipping when.

## Contributing

We welcome PRs of all sizes.

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
3. Pick an issue labeled [`good first issue`](../../issues?q=is%3Aopen+label%3A%22good+first+issue%22)
4. Or fix a typo, improve the docs, or add a test — every bit helps

> ⚠️ **The scoring algorithm is the product.** Changes to
> `packages/consensusflow/scoring/*` require maintainer review and a
> methodology bump. See [CONTRIBUTING.md](./CONTRIBUTING.md#scoring-changes).

## Security

Found a vulnerability? Please **do not** open a public issue. Email
`security@consensusflow.app` (or use GitHub's [private vulnerability
reporting](../../security/advisories/new)). See [SECURITY.md](./SECURITY.md)
for our response SLA.

## Community

- 💬 Chat: TBD (Discord / Matrix)
- 🐦 Updates: TBD
- 📧 Newsletter: TBD

## Sponsors & backers

We are independently developed. If you or your org relies on ConsensusFlow,
consider [sponsoring on GitHub](../../sponsors) to support ongoing work.

## License

[MPL-2.0](./LICENSE) — free to use, modifications to our files must stay open.

---

*Built with care by [Adharsh](https://github.com/adharshh2010) and contributors.*
