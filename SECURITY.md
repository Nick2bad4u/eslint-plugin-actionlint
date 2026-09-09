# Security Policy

## Reporting a Vulnerability

If you discover a vulnerability in this repository, report it privately using one
of these channels:

- GitHub Security Advisory draft: <https://github.com/Nick2bad4u/eslint-plugin-actionlint/security/advisories/new>
- Maintainer email: <20943337+Nick2bad4u@users.noreply.github.com>

Please do **not** open public issues for unpatched vulnerabilities.

Include as much detail as possible:

- Affected version(s)
- Reproduction steps or proof of concept
- Security impact
- Any known mitigations

## Supported Versions

Only the latest published release is considered actively supported for security
fixes.

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| Older   | ❌        |

## Response Expectations

- Initial acknowledgment target: within 7 days
- Triage and remediation timeline: depends on severity and complexity
- Public disclosure: after a fix is available or a coordinated disclosure date is agreed

## Security Best Practices for Users

- Keep `eslint-plugin-actionlint`, ESLint, TypeScript, and dependencies updated.
- Run linting in CI on trusted code only.
- Review new rule autofixes before applying at scale.

## Dependency review for the Windows archive fix

Windows downloads are checksum verified and decoded with `fflate`. Only the
expected root executable is written, using exclusive creation inside a unique
staging directory. Archive entry names never become output paths. Regression
tests cover directory links, traversal entries, and a missing executable.

The documentation build uses narrow security overrides for `qs`,
`serialize-javascript`, and the `uuid` dependency of `sockjs`. Docusaurus's
`image-size` dependency is replaced with the compatible `image-size-next` parser.
`npm run test:docs-images` verifies its actual Docusaurus resolution against
malformed ICNS, JXL, and HEIF files and normal SVG, GIF, and PNG dimensions. This
check runs in CI and release verification.

The September 2026 release review found no advisories in this package's production
dependencies. The development shared ESLint configuration still installs the
previously published `eslint-plugin-actionlint`, which brings `adm-zip` and the
moderate [GHSA-vwc7-r8mq-g2x9 advisory](https://github.com/advisories/GHSA-vwc7-r8mq-g2x9).
That bootstrap dependency is excluded from the published package. Its downloader
accepts only checksum-verified official archives and extracts into a new staging
directory, limiting exposure to the advisory's pre-existing-link condition.
Consumers of the shared configuration should update their lockfiles after the
fixed actionlint plugin is published.

## Credits

Responsible disclosure is appreciated. We can credit reporters in release notes
if requested.
