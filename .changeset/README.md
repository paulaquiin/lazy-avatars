# Changesets

Run `pnpm changeset` for changes to the public API or generated output. Explain
the consumer-visible behavior and update a collection's `outputVersion` when its
existing output changes. Before 1.0, use a minor release for incompatible changes
and record the output change explicitly. From 1.0 onward, use a major release.

Version 0.1.0 has been prepared with Changesets. The first npm publication still
requires an authenticated maintainer session; it is not an automatic CI step.
See docs/RELEASING.md for the reviewed publication procedure.
