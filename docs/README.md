# WorkOS Documentation

**Welcome to the WorkOS documentation hub.**

This directory contains the foundational architecture, rules, and guidelines for the WorkOS multi-organization workforce operating system.

---

## 📜 Core Documents

### **[WorkOS Constitution](./WORKOS-CONSTITUTION.md)** ⭐
**The single source of truth for the entire system.**

This is the canonical document that defines:
- **Role Layers** (Platform Admin, Org Owner, Org Admin, Manager, Employee)
- **Domain Model** (9 domains: WORK, PEOPLE, TIME, FINANCE, COMMUNICATION, ANALYTICS, SECURITY, PLATFORM, INTEGRATIONS)
- **Data Flow Law** (Mandatory rules: TIME→FINANCE, PEOPLE→WORK, WORK→FINANCE, etc.)
- **Module Registry** (Exhaustive inventory of all 57+ modules)
- **UX Binding Rules** (Navigation, layouts, consistency)
- **Build Order Roadmap** (5 phases: Skeleton → Stubs → Wiring → Polish → Auth)

**When in doubt, consult the Constitution.**

**When code conflicts with the Constitution, fix the code.**

**When the Constitution is incomplete, amend it first.**

---

## 📂 Document Structure

```
/docs/
├── README.md                    ← You are here
├── WORKOS-CONSTITUTION.md       ← ⭐ MAIN DOCUMENT
├── QUICK-REFERENCE.md           ← One-page cheat sheet
├── diagnostics/                 ← Diagnostic outputs (markdown only)
│   └── README.md                ← Diagnostics policy & rules
├── adrs/                        ← Architecture Decision Records (future)
├── api/                         ← API Documentation (future)
└── domains/                     ← Domain-specific deep dives (future)
```

---

## 🎯 Quick Navigation

### For Architects & Tech Leads
Read: **[WorkOS Constitution](./WORKOS-CONSTITUTION.md)**
Focus on:
- Domain Model (ownership rules)
- Data Flow Law (inter-domain rules)
- Module Registry (what exists)

### For Product Managers
Read: **[WorkOS Constitution](./WORKOS-CONSTITUTION.md)** → Module Registry
Focus on:
- What modules exist per domain
- Role-based feature access
- Build Order Roadmap

### For Developers
Read: **[WorkOS Constitution](./WORKOS-CONSTITUTION.md)** → Data Flow Law + UX Binding Rules
Focus on:
- Data flow rules (TIME→FINANCE, etc.)
- Violation examples (what NOT to do)
- Navigation consistency
- Verification checklists

### For QA/Testers
Read: **[WorkOS Constitution](./WORKOS-CONSTITUTION.md)** → Verification Checklists
Focus on:
- Constitutional Compliance Checklist
- Data Flow Validation Checklist
- Navigation Audit Checklist
- Skeleton Lock Audit

---

## 🔍 How to Use This Documentation

### Before Building a New Feature:
1. Read the **Domain Model** section
2. Identify which domain owns the feature
3. Check **Data Flow Law** for inter-domain dependencies
4. Verify the feature is in the **Module Registry**
5. Follow **UX Binding Rules** for consistency

### Before Making Architectural Changes:
1. Check if it conflicts with the **Constitution**
2. If it does, propose a **Constitutional Amendment**
3. Document the change in the Amendment Log
4. Update all affected documentation

### Before Deploying:
1. Run all **Verification Checklists**
2. Ensure **Data Flow Law** compliance
3. Verify **Navigation Audit** passes
4. Check **Skeleton Lock Audit** (no unauthorized routes)

---

## 🚨 Critical Rules

### Rule 1: Constitution is Law
The **WorkOS Constitution** supersedes all other documents, code comments, and implementation decisions.

### Rule 2: Single Source of Truth
Do NOT create duplicate architecture docs. Everything goes in the Constitution or links from it.

### Rule 3: Amend, Don't Fork
If the Constitution is wrong or incomplete, **amend it**. Don't create conflicting documents.

### Rule 4: Violation = Refactor
If code violates the Constitution, the **code must change**, not the Constitution (unless you amend it properly).

---

## 📊 Document Status

| Document | Status | Last Updated | Version |
|----------|--------|--------------|---------|
| WorkOS Constitution | ✅ Active | 2026-01-07 | 1.0 |
| README (this file) | ✅ Active | 2026-01-07 | 1.0 |

---

## 🔜 Planned Documentation

Future additions to this directory:

- **ADRs** (`/docs/adrs/`) - Architecture Decision Records for major decisions
- **API Docs** (`/docs/api/`) - REST API reference, authentication, webhooks
- **Domain Deep Dives** (`/docs/domains/`) - Detailed specs for each domain
- **Integration Guides** (`/docs/integrations/`) - How to connect external systems
- **Deployment Guide** (`/docs/deployment/`) - Production deployment steps

---

## 📧 Questions?

If you have questions about:
- **Architecture:** Check the Constitution → Domain Model
- **Data flows:** Check the Constitution → Data Flow Law
- **Features:** Check the Constitution → Module Registry
- **UI patterns:** Check the Constitution → UX Binding Rules
- **Build process:** Check the Constitution → Build Order Roadmap

**Still unsure? The Constitution has the answer. Read it thoroughly.**

---

**Last Updated:** January 7, 2026  
**Maintained By:** WorkOS Core Team  
**Source:** `/docs/` directory