# 05 — BRAND STRATEGY, OFFICIAL LOGO AUDIT & MESSAGING ARCHITECTURE

**Date:** 2026-11-27  
**Canonical Brand Name:** **Tech Groww** (`TECH GROWW`)  
**Canonical Tagline:** *Technology That Drives Growth.*

---

## 1. Purpose & Scope

Establishes Tech Groww's brand identity, official logo geometry and technical asset specification (based on direct inspection of `C:\Users\MSI\Downloads\techgroww_logo.svg`), verbal tone, and anti-AI-template design guardrails.

**Dependencies:** `COMPANY_RESEARCH_AND_AUDIT.md` (Doc 02), `COMPANY_INFORMATION_VERIFICATION.md` (Doc 03), `COMPETITOR_RESEARCH.md` (Doc 04).

---

## 2. Official Brand Asset Inspection (`techgroww_logo.svg`)

### 2.1 File & Structure Audit
- **Source File Inspected:** `C:\Users\MSI\Downloads\techgroww_logo.svg` (`50,753 bytes`)
- **Canvas Dimensions:** `1536 × 1536` (`viewBox="0 0 1536 1536"`)
- **Technical Finding:** The master `.svg` contains an `<image>` tag wrapping a base64-encoded stream labeled `xlink:href="data:image/png;base64,/9j/4AAQ..."` — the `/9j/4AAQ` header confirms it is actually a **JPEG raster image mislabeled as a PNG data URI** embedded on an **opaque dark navy background** inside the SVG container, rather than native SVG `<path>` primitives. Because JPEG lacks an alpha channel, clean transparent-background extraction from this raster alone is impossible; **clean pure-vector SVG tracing** is mandatory for production marks.
- **Observed Visual Composition:**
  1. **Background Tile:** Deep midnight navy (`#060B18`–`#0B132B`) with subtle center-top radial depth.
  2. **Symbol Geometry:** Symmetrical 3D-faceted upward **delta / arrowhead** split down a crisp center spine (lighter cerulean/sky-blue left facet `--brand-sky` `#38BDF8` -> `--brand-cobalt` `#0284C7`, deeper cobalt/royal-blue right facet `--brand-cobalt` `#0284C7` -> `--brand-royal` `#1D4ED8`), resting above two splayed **angled chevron wings** with a clean negative-space gap between arrowhead notch and wings.
  3. **Stacked Wordmark:** Bold geometric uppercase **`TECH`** in pure white (`#FFFFFF`), centered above wider-tracked lighter uppercase **`G R O W W`** in cool slate-blue (`--wordmark-slate: #94A3B8`).
- **Secondary Asset Inspected:** Uploaded LinkedIn cover banner — deep midnight navy (`#040A17`), centered crisp white wordmark `TECH GROWW`, spaced sub-line `TECHNOLOGY THAT DRIVES GROWTH`, subtle corner constellation dots and thin curved orbital waves.

### 2.2 Logo Usage & Refinement Rules (Never Silently Redesign)
| Rule Area | Specification |
|---|---|
| **Geometry Preservation** | Preserve the exact delta-arrowhead + chevron wing proportions and dual-facet lighting. Do not replace the mark with an invented icon. |
| **Vectorization Requirement** | During implementation (`ENG-102`), maintain faithful square icon/OG raster exports (`apple-touch-icon.png`, `og-banner.jpg`) AND author clean **pure-vector traced SVG exports** (`mark.svg`, `lockup-horizontal-dark.svg`, `lockup-horizontal-light.svg`, `lockup-horizontal-white.svg`, `lockup-stacked.svg`) matching exact source geometry without base64 JPEG bloat. |
| **Clear Space** | Minimum clear space around the emblem equal to `0.5 × mark width` on all four sides. |
| **Minimum Size** | Horizontal lockup minimum `120px` width (`24px` height); icon-only mark minimum `20px × 20px` (favicon uses simplified high-contrast delta silhouette at `16px`/`32px`). |
| **Light vs Dark & Portal Variants** | **On Dark (`--ink` `#070D19`):** `#FFFFFF` `TECH`, `--wordmark-slate` `#94A3B8` `G R O W W`, `#38BDF8 -> #0284C7 -> #1D4ED8` mark.<br>**On Light (`--paper` `#F5F2EB`):** `--ink` `#070D19` `TECH`, `--brand-royal` `#1D4ED8` `G R O W W`, deepened mark gradient stops **`#0369A1 -> #1E40AF`** (`>= 4.5:1` contrast).<br>**On Portal White (`--portal-surface` `#FFFFFF`):** `--ink` `#070D19` `TECH`, `--brand-royal` `#1D4ED8` `G R O W W`, deepened `#0369A1 -> #1E40AF` mark.<br>**Monochrome:** Single-color `#070D19` or `#FFFFFF` flat-facet mark for print/watermarks/certificates. |
| **Prohibited Alterations** | Never stretch, add neon outer drop-shadows, rotate the upward arrowhead, change `GROWW` spelling, or place the dark-navy square JPEG tile directly onto light stone (`#F5F2EB`) or portal white (`#FFFFFF`) backgrounds without transparent pure-vector tracing. |

---

## 3. Brand Positioning & Strategic Pillars

### 3.1 Positioning Statement
> For startups, SMBs, and growing enterprises who want dependable software rather than agency theatre, **Tech Groww** is a Greater Noida technology and digital engineering partner delivering custom web and mobile applications, Salesforce (Admin & OmniStudio), UI/UX, enterprise software, and strategic IT consulting — scoped honestly and built with direct principal accountability.

### 3.2 Brand Voice & Copy Principles
- **Honest Early-Stage Confidence:** Founded in `2026`. Never fake a 10-year history or anonymous Fortune 500 claims. Compete on focus, direct access to engineers, and architectural clarity.
- **Business-First Language:** Explain operational outcomes first, technology second.
- **Anti-Buzzword Rule:** Ban empty filler (`"revolutionary"`, `"cutting-edge"`, `"next-gen synergy"`, `"10x your business"`).

### 3.3 Four Core Operating Pillars
1. **Business-First Problem Framing** — Diagnose the real bottleneck before recommending software.
2. **Practical, Buildable Architecture** — Scope to real budgets, team bandwidth, and delivery dates.
3. **Direct Collaboration** — Work directly with the builders; no account-manager telephone games.
4. **End-to-End Accountability** — Clear milestones, documented codebases, and owned post-launch support.

---

## 4. Anti-AI-Template Guardrails

Explicitly banned from all public UI and copy:
- Generic purple-indigo-violet gradients (`#7C3AED` glows from legacy CSS)
- Floating glossy 3D spheres, neural-network particle meshes, or robot illustrations
- Stock photography of handshakes, glass skyscrapers, or staged office smiles
- Repetitive uniform Bento grids with glowing borders
- Unverified percentage claims (`99.9% uptime`, `95+ PageSpeed`, `650ms`)

---

## 5. Decisions, Assumptions, Confirmations & Acceptance Criteria

- **Decision:** Anchor visual identity to the official deep midnight navy + faceted cerulean/cobalt/royal blue of `techgroww_logo.svg`, contrasted with warm architectural stone (`#F5F2EB`) rather than sterile SaaS white or violet gradients.
- **Assumption:** Leadership accepts pure-vector traced SVG exports derived faithfully from `techgroww_logo.svg` in place of the legacy base64-JPEG SVG wrapper.
- **Outstanding Confirmations:**
  1. `[COMPANY CONFIRMATION REQUIRED: Formal visual sign-off on pure-vector SVG lockup exports (dark, light, portal white, monochrome) traced from techgroww_logo.svg]` (`21` `C-11`).
  2. Confirm whether `Tech Groww` vs `[COMPANY CONFIRMATION REQUIRED: Official legal entity name]` appears in legal copyright strings (`21` `C-01`).
- **Acceptance Criteria:** 100% of public pages use verified brand name (`Tech Groww`), tagline (`Technology That Drives Growth`), and pure-vector official mark variants; zero legacy purple gradients or unverified claims appear.
- **Cross-References:** `CREATIVE_DIRECTION.md` (Doc 06), `08_DESIGN_SYSTEM_AND_UI_SPECIFICATION.md`, `09_PUBLIC_WEBSITE_CONTENT_AND_PAGE_SPECIFICATIONS.md`.
