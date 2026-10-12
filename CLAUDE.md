# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and GitHub Copilot CLI when working in this repository.

Bulk Copy is a VS Code extension that copies a folder's file and folder tree to the clipboard as indented text, with configurable depth, filters and formatting. It is published on the Marketplace as `maxs-lab-of-things.bulk-copy`. The repository is public.

## Commands

```bash
npm run compile      # tsc -p ./ -> out/
npm run watch
npx vsce package     # read the printed file list before publishing
```

Run the extension with F5 from VS Code (`.vscode/launch.json`). There are no tests and no lint script.

## Structure

All logic is in `src/extension.ts`. `bulk-copy.copyStructure` is offered on folders in the Explorer context menu (`menus.explorer/context` in `package.json`); it reads the twelve `bulk-copy.*` settings, walks the folder within `maxDepth`, `maxItemsPerLevel` and `maxTotalItems`, builds the indented outline and writes it with `vscode.env.clipboard.writeText`. `bulk-copy.openSettings` opens the settings filtered to this extension. A new setting has to be declared under `contributes.configuration` in `package.json`, read in `extension.ts`, and listed in the README's Settings section.

`bulk-copy-0.0.1.zip` is a tracked snapshot of the July 2025 source, not the current code.

## Releasing

`.vscodeignore` is the only control over what ships in the `.vsix`; `.gitignore` is ignored by `vsce`. The managed block in it is rewritten by a standardizing script, so add project-specific exclusions outside that block. The README states the Marketplace version, so bump it with `package.json` and `CHANGELOG.md`. The publishing procedure is in `../README.md`.
