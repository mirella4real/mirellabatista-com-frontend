# mirellabatista-com-frontend

Frontend for [mirellabatista.com](https://www.mirella-batista.com) — a resume site built and
deployed on AWS as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev)
(AWS 2026 version).

## About This Project

This site is the result of completing the [Cloud Resume Challenge](https://cloudresumechallenge.dev)
(AWS 2026 version) — a hands-on project designed to build and demonstrate real cloud engineering
skills.

The challenge was completed with the assistance of Claude and Claude Code as AI pair programming
tools. Rather than copying solutions, the approach throughout was deliberate and methodical:
concepts were explained before execution, every step was verified with terminal output or
screenshots, and nothing was assumed complete until confirmed working. Claude Code was used for
file creation and terminal commands; Claude (claude.ai) was used for architecture decisions,
concept explanations, and document generation.

This reflects how I believe AI tools should be used in engineering: as a thinking partner that
accelerates learning and execution, not a replacement for understanding.

## Live Site

[www.mirella-batista.com](https://www.mirella-batista.com)

## Tech Stack

- HTML, CSS, vanilla JavaScript
- AWS S3 (static hosting)
- AWS CloudFront (CDN + HTTPS)
- AWS Route 53 (DNS)
- AWS ACM (SSL certificate)
- GitHub Actions (CI/CD)

## UX Design

The site was fully redesigned with a custom design system built in vanilla CSS, using CSS custom
properties for a consistent type scale, spacing scale, and brand color palette. Colors were chosen
to meet WCAG accessibility contrast standards.

The layout is **mobile-first**: the mobile experience is designed independently from desktop, with
distinct layouts at each breakpoint rather than simply scaling down a desktop view. Key differences
include single-column stacking, tighter line heights, smaller pill and button sizes, and reordered
content blocks where appropriate.

Features built as part of the redesign:

- **Sticky pill carousel navigation** — a horizontal scrollable pill nav that highlights the active
  section on scroll and centers the active pill in view, replacing a traditional hamburger menu
  across all breakpoints
- **Collapsible role cards** — experience bullets are hidden by default with a Show/Hide toggle,
  reducing page length without sacrificing detail; built with progressive enhancement so content
  remains fully accessible without JavaScript
- **Video tap-to-play** — hero video loads as a static thumbnail on mobile and activates inline on
  tap, avoiding autoplay and unnecessary bandwidth
- **Progressive enhancement** — a `js-enabled` class is applied to `<html>` only when JavaScript
  loads, ensuring all content is visible and usable in JS-off environments

## Architecture

The site is a static HTML/CSS/JavaScript resume hosted on S3 and served globally via CloudFront.
Route 53 handles DNS routing to the CloudFront distribution. ACM provides the SSL certificate
for HTTPS.

A JavaScript fetch call on page load hits a serverless API (managed in the backend repo) that
returns a live visitor count displayed at the bottom of the page.

### Code Quality

ESLint and Prettier are configured to enforce consistent code style across HTML, CSS, and
JavaScript. A Husky pre-commit hook runs formatting checks, linting, and the full unit test suite
before every commit, ensuring nothing broken or unformatted reaches the repository.

### Unit Tests

The JavaScript is covered by a Jest + jsdom unit test suite (`tests/scripts.test.js`) that runs
in a simulated browser environment. Tests cover the `js-enabled` class, pill nav active state
logic, role card toggle behavior, and video tap-to-play interactions. The test suite runs as part
of the Husky pre-commit hook so no untested code reaches the repo.

### Cache Busting

Although the CI/CD pipeline invalidates the CloudFront cache on every deploy, browser-level
caching can still cause users to load stale CSS or JavaScript — particularly when a file at the
same URL was previously cached locally. This was observed in practice after the site redesign was
deployed.

To address this, asset references in `index.html` include a `?v=__CACHE_VERSION__` query string.
The CI pipeline replaces this placeholder with a Unix timestamp at deploy time. Because the URL
changes on every deploy, browsers treat it as a new asset and fetch the latest version regardless
of local cache state.

## CI/CD Pipeline

Every push to `main` that touches `index.html`, `css/`, or `scripts/` triggers a GitHub Actions
workflow that:

1. Runs ESLint
2. Runs Prettier formatting check
3. Runs the Jest unit test suite
4. Injects the AWS API endpoint into `scripts.js`
5. Injects a Unix timestamp cache-busting version into `index.html`
6. Authenticates to AWS via OIDC (no stored credentials)
7. Syncs files to S3
8. Invalidates the CloudFront cache

## What I Learned

_A full write-up is coming in a blog post. Topics will include: static site hosting on AWS,
CloudFront cache management, OIDC authentication, and building a CI/CD pipeline from scratch._

## Related

- [Backend repo](https://github.com/mirella4real/mirellabatista-com-backend) — serverless visitor
  counter (Lambda + DynamoDB + API Gateway + Terraform)
