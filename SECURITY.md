# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The FractiAI team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to **info@fractiai.com** with the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will send you regular updates about our progress
- **Timeline**: We aim to patch critical vulnerabilities within 7 days
- **Credit**: We will credit you in our security advisory (unless you prefer to remain anonymous)

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit a security issue you discover for any reason
- Report vulnerabilities to us in a timely manner

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices for Users

### Environment Variables
- **Never commit `.env` files** to version control
- **Rotate API keys** regularly
- **Use environment-specific keys** (dev, staging, prod)

### API Keys
- **Groq API Key**: Keep your key private
- **Use key restrictions**: Limit by domain, IP, or application if possible
- **Monitor usage**: Check for unauthorized API calls

### Deployment
- **HTTPS Only**: Always use HTTPS in production
- **Content Security Policy**: Implement CSP headers
- **Subresource Integrity**: Use SRI for CDN resources
- **Regular Updates**: Keep dependencies up-to-date

### Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (review changes first)
npm audit fix

# For breaking changes
npm audit fix --force
```

## Known Security Considerations

### Client-Side API Key
⚠️ **Note**: The Groq API key is exposed in the client-side code. For production deployments:

1. **Backend Proxy**: Route API calls through your own backend
2. **Rate Limiting**: Implement server-side rate limiting
3. **Key Rotation**: Rotate keys regularly
4. **Domain Restrictions**: Configure API key domain restrictions in Groq dashboard

Example backend proxy (Node.js/Express):
```javascript
app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body)
  })
  const data = await response.json()
  res.json(data)
})
```

### Third-Party Dependencies
We regularly monitor and update dependencies. Current security-sensitive packages:

- **React**: XSS protection built-in
- **Three.js**: No known security issues
- **Vite**: Keep updated for latest security patches
- **Groq SDK**: Uses HTTPS, validates responses

## Security Updates

We will announce security updates through:

- GitHub Security Advisories
- Release notes with `[SECURITY]` tag
- Email to registered users (if applicable)

## Compliance

This project follows:

- **OWASP Top 10**: Web application security standards
- **CWE Top 25**: Common weakness enumeration
- **GDPR**: No personal data collection without consent

## Questions?

If you have questions about this security policy, please contact us at info@fractiai.com.

---

**Last Updated**: January 2026

Thank you for helping keep Holographic Hydrogen Fractal MRI Demo and its users safe! ⚡




