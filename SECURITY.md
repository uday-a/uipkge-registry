# Security Policy

UIPKGE takes the security of our open-source component registry and our users seriously.

---

## Supported Versions

Because UIPKGE is an unbundled registry where components are copied directly into user codebases rather than installed as immutable packages, fixes and security patches are released directly to `main` and immediately served via the registry API (`https://uipkge.dev/r/...`).

| Version | Supported | Notes |
|---|---|---|
| `main` (Latest) | :white_check_mark: | Actively supported and updated |
| Legacy / Frozen forks | :x: | Consumers should pull updated components from the registry |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability in any component, block, utility, or build script within UIPKGE:

1. **Please do NOT report security vulnerabilities via public GitHub issues.**
2. Instead, report security issues via **GitHub Private Vulnerability Reporting** directly on the repository:
   - Navigate to the [Security Advisory page](https://github.com/uday-a/uipkge-registry/security/advisories)
   - Click **"Report a vulnerability"**
3. Alternatively, email the maintainers directly at: **security@uipkge.dev** (or contact **uday@uipkge.dev**).

### What to Include

Please provide:
- A description of the vulnerability and potential impact.
- Affected component(s) or file paths (e.g. `packages/vue/components/dialog/...`).
- Steps to reproduce or a minimal proof of concept (PoC).
- Any proposed mitigations or fixes.

### Our Commitment

- We will acknowledge receipt of your report within **48 hours**.
- We will provide a status update with assessment and mitigation timeline within **5 business days**.
- Once fixed, we will publicly credit you in our release notes (unless you prefer to remain anonymous).
