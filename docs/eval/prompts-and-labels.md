# Evaluation Pack: Prompts + Labeled Examples

Purpose
- Validate the MVP: diversity detection and single-pass synthesis.
- Give raters consistent guidance and provide a reusable prompt bank.

How to use
1) Run comparisons on the Labeled Set first (15 items) to establish accuracy and helpfulness baselines.
2) Use the Unlabeled Prompt Bank (25 items) for broader testing and A/Bs.
3) For each labeled item, compare detected diversity and synthesis against the expected labels and acceptance criteria.

Quick rubric (rater-facing)
- Diversity present: The two model answers differ in substance (reasoning approach, values, scope, methodology), not merely phrasing.
- Helpful diversity: The differences expose trade-offs or complementary angles that a synthesis can reconcile.
- Good synthesis includes:
  - Common ground (what both agree on)
  - Key disagreements and why
  - Clear trade-offs (when to pick A vs. B)
  - Concrete recommendation + caveats
  - Token budget guideline: 400–600 tokens (MVP standard)

Unlabeled prompt bank (25)
1) Choose a database for a high-write, event-driven analytics pipeline handling 50K events/sec. Recommend schema and partitioning strategy.
2) Should we launch a freemium tier for our developer tool? Outline expected impacts on activation, revenue, and support load.
3) Design a privacy policy approach for a consumer health app collecting wearable data. Address consent, retention, and data sharing.
4) Recommend a migration plan from a monolith to microservices for a mid-sized SaaS. Include risks and phased milestones.
5) Evaluate whether to adopt feature flags or trunk-based branching to speed up delivery while maintaining quality.
6) What KPIs should a PLG SaaS track in the first 6 months post-launch? Explain trade-offs in metric selection.
7) Recommend a strategy to reduce cloud costs by 20% without harming SLOs. Include observability tactics.
8) Create an incident response playbook for PII exposure detected in logs. Prioritize steps in the first 24 hours.
9) Decide between GraphQL and REST for a public API targeting third-party integrations. Consider caching, versioning, and rate limits.
10) Outline an LLM evaluation plan for summarization quality in a customer support context. Include metrics and sampling.
11) Draft a go-to-market plan for an AI note-taking app in the SMB segment. Prioritize channels and pricing experiments.
12) Propose a test strategy for a React + Next.js app with server actions and RSC. Balance unit, integration, and e2e.
13) Recommend a data model for a multi-tenant SaaS with customizable entities and RBAC at org/project/resource levels.
14) Evaluate whether to build a native mobile app or PWA for a content platform. Consider offline, perf, and distribution.
15) Design a backlog prioritization framework for a cross-functional team with conflicting stakeholder requests.
16) Propose guardrails to mitigate hallucinations in a retrieval-augmented QA bot used by support agents.
17) Recommend an ETL vs. ELT approach for analytics on top of Postgres + warehouse. Include tooling choices.
18) Create a policy for AI-generated content disclosure in a news publisher. Address reader trust and SEO.
19) How should we split a single codebase into packages (turborepo) to improve build times and modularity?
20) Decide between managed Kubernetes and serverless for a spiky workload with occasional heavy compute.
21) Recommend a roadmap to achieve SOC 2 Type II in 6 months for a seed-stage startup. Include key milestones.
22) Outline an experimentation framework (A/B, bandits) for onboarding flows with low traffic.
23) Choose a vector DB for semantic search on 5M docs. Discuss ingestion, indexing, and recall/latency trade-offs.
24) Propose a content moderation policy for a social app balancing free expression and safety.
25) Recommend a strategy to internationalize a web app (i18n) with RTL support and dynamic locale data.

Labeled set (15)
- See the machine-readable JSON: docs/eval/labeled-examples.json
- Each item includes: id, domain, prompt, expected_diversity, diversity_type, expected_difference_markers, expected_helpfulness, acceptance_criteria, expected_synthesis_guidelines, risk_flags, difficulty, notes.

Rater checklist (per labeled item)
- Was diversity detected? (Y/N) Does it match expected_diversity?
- If Y: Did the difference align with expected markers? (High/Med/Low)
- Was the synthesis helpful? (Y/N) & Why
- Did synthesis include: common ground, disagreements, trade-offs, recommendation, caveats? (checklist)
- Any safety or hallucination issues? (Y/N) Notes

Success thresholds (apply your MVP targets)
- Diversity detection accuracy ≥70% on labeled set
- Helpfulness (Yes) ≥70% on synthesis for labeled set
- Time-to-synthesis p50 ≤12s, p95 ≤25s
- Cost p95 ≤$0.25/session
