# Security

This is a personal website. It has no backend, no database, and no
authentication. The only client-side state is a theme preference in
`localStorage`.

The one place visitor data exists at all is the contact form. A submitted
message and reply address are relayed through [FormSubmit](https://formsubmit.co)
to my inbox; the site itself stores nothing, and no analytics or tracking run
anywhere.

## Reporting

If you find something, email **lakyvasu22@gmail.com** rather than opening a
public issue. Include the URL, the browser, and what you did to trigger it. I
will confirm within a few days.

## Scope

In scope:

- Anything that lets a third party inject or execute script on the deployed site
- Anything that leaks visitor data, including contact form submissions in transit
- Abuse of the contact form endpoint beyond ordinary spam (e.g. header injection)
- Supply-chain problems in the dependencies listed in `package.json`

Not in scope:

- Missing hardening headers on the preview deployments
- Findings that require a compromised browser or extension
- Automated scanner output with no demonstrated impact
