# Changesets

Run `pnpm changeset` for changes to the public API or generated output. Explain
the consumer-visible behavior and update a collection's `outputVersion` when its
existing output changes. Before 1.0, use a minor release for incompatible changes
and record the output change explicitly. From 1.0 onward, use a major release.

The initial engine is unpublished (`0.0.0`). There is no automatic publishing
workflow in phase 0. Package names must be confirmed before the first release.
