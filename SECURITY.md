# Security Policy

UIPKGE takes the security of our open-source component registry and our users seriously.

---

## Supported Versions

Because UIPKGE is an unbundled registry where components are copied directly into user codebases rather than installed as immutable packages, fixes and security patches are released directly to `main` and immediately served via the registry API (`https://uipkge.dev/r/...`).

| Version               | Supported          | Notes                                                      |
| --------------------- | ------------------ | ---------------------------------------------------------- |
| `main` (Latest)       | :white_check_mark: | Actively supported and updated                             |
| Legacy / Frozen forks | :x:                | Consumers should pull updated components from the registry |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability in any component, block, utility, or build script within UIPKGE:

1. **Please do NOT report security vulnerabilities via public GitHub issues.**
2. Report it through **GitHub Private Vulnerability Reporting** on this repository:
   - Open the [Security Advisories page](https://github.com/uday-a/uipkge-registry/security/advisories)
   - Click **"Report a vulnerability"** and fill in the form. Only the maintainers can see it.
3. If the form is unavailable to you, open a GitHub issue titled **`Security: request for private contact`** with **no technical details**. A maintainer will reply with a private channel.

The project has no e-mail inbox; GitHub is the only reporting channel.

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
