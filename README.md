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

## Architecture

The site is a static HTML/CSS/JavaScript resume hosted on S3 and served globally via CloudFront.
Route 53 handles DNS routing to the CloudFront distribution. ACM provides the SSL certificate
for HTTPS.

A JavaScript fetch call on page load hits a serverless API (managed in the backend repo) that
returns a live visitor count displayed at the bottom of the page.

## CI/CD Pipeline

Every push to `main` that touches `index.html`, `css/`, or `scripts/` triggers a GitHub Actions
workflow that:

1. Runs ESLint
2. Runs Prettier formatting check
3. Authenticates to AWS via OIDC (no stored credentials)
4. Syncs files to S3
5. Invalidates the CloudFront cache

## What I Learned

_A full write-up is coming in a blog post. Topics will include: static site hosting on AWS,
CloudFront cache management, OIDC authentication, and building a CI/CD pipeline from scratch._

## Related

- [Backend repo](https://github.com/mirella4real/mirellabatista-com-backend) — serverless visitor
  counter (Lambda + DynamoDB + API Gateway + Terraform)
