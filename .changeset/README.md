# Changesets

Run `pnpm changeset` for changes to the public API or generated output. Explain
the consumer-visible behavior and update a collection's `outputVersion` when its
existing output changes. Before 1.0, use a minor release for incompatible changes
and record the output change explicitly. From 1.0 onward, use a major release.

Version 0.1.0 was published to npm on 2026-10-24 after maintainer 2FA approval.
Publication is a manual release step; CI does not store an npm token or publish packages.
See docs/RELEASING.md for the reviewed publication procedure.

Version 0.2.0 was published on 2026-10-24 after successful CI and maintainer 2FA.
Registry installation, all nine subpaths, types and tarball integrity were verified.
The v0.2.0 tag points at the exact published commit.
The formatter is disabled for changeset Markdown to preserve YAML frontmatter.

Version 0.3.0 was published on 2026-10-24 after successful CI and maintainer 2FA.
All thirteen subpaths, public types and tarball integrity passed registry installation checks.
The v0.3.0 tag points at the exact published commit.
