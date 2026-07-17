# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | ✅ Yes     |
| < 1.0   | ❌ No      |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in BidiKit, please follow responsible disclosure:

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email us directly at: `security@bidikit.dev`
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge your report within 48 hours and provide a fix timeline.

## Security Best Practices

When using BidiKit:

- Always validate user-provided locale values before passing to BidiKit
- Do not store sensitive data in translation files
- Use server-side locale detection in production with proper input sanitization
- Keep BidiKit packages updated to the latest version
