# Security

This is a personal website. It has no backend, no database, no authentication,
and it stores nothing about visitors. The only client-side state is a theme
preference in `localStorage`.

## Reporting

If you find something, email **lakyvasu22@gmail.com** rather than opening a
public issue. Include the URL, the browser, and what you did to trigger it. I
will confirm within a few days.

## Scope

In scope:

- Anything that lets a third party inject or execute script on the deployed site
- Anything that leaks visitor data
- Supply-chain problems in the dependencies listed in `package.json`

Not in scope:

- Missing hardening headers on the preview deployments
- Findings that require a compromised browser or extension
- Automated scanner output with no demonstrated impact
