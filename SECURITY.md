# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depend on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Editor Blocks seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **contact@coderooz.in**.

Include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- You will receive an acknowledgment of your report within 48 hours
- We will investigate and validate the vulnerability
- We will keep you informed of our progress
- Once fixed, we will release a patch and credit you (if desired)

## Security Best Practices

### For Users

- Always use the latest version
- Keep dependencies updated
- Use HTTPS in production
- Sanitize editor output before rendering
- Implement Content Security Policy (CSP)

### For Contributors

- Never commit secrets, API keys, or credentials
- Validate all user inputs
- Use parameterized queries (when applicable)
- Follow OWASP guidelines
- Run security audits regularly: `npm audit`

## Known Security Considerations

### Editor Content Sanitization

The editor outputs HTML/JSON content. Always sanitize before:
- Rendering in the browser
- Storing in databases
- Sending to APIs

Recommended: Use DOMPurify or similar library.

### Dependencies

Regularly audit dependencies:
```bash
npm audit
npm audit fix
```

### Deployment

- Use Vercel's built-in security features
- Enable HTTPS (automatic on Vercel)
- Configure proper headers via `next.config.ts`

## Disclosure Policy

When we receive a security vulnerability report, we will:

1. Acknowledge receipt within 48 hours
2. Investigate and validate within 7 days
3. Develop and test a fix
4. Release a patch
5. Publicly disclose the vulnerability after users have had time to upgrade

## Contact

For security concerns, contact: **contact@coderooz.in**

For general questions, use GitHub Issues.