# bulk-copy

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.bulk-copy) ![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Bulk Copy is a VS Code extension for copying a folder's file and folder structure to the clipboard with configurable depth, formatting and filters. It is published on the VS Code Marketplace as [`maxs-lab-of-things.bulk-copy`](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.bulk-copy); the Marketplace version is 1.5.1, matching this repository.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/bulk-copy.gif)

**Objective:** make a quick, shareable text outline of a folder for documentation, planning, audits and code review without leaving VS Code.

**Inputs:** VS Code 1.74.0 or newer, a workspace folder and the folder selected in the Explorer. The extension reads local file names and writes the generated outline to the VS Code clipboard.

**Files:**

- [`src/`](src/): extension activation, Explorer command handling, structure traversal and clipboard output
- [`images/`](images/): Marketplace icon asset
- [`package.json`](package.json): extension manifest, Marketplace metadata, commands, settings and scripts
- [`CHANGELOG.md`](CHANGELOG.md): release notes
- [`tsconfig.json`](tsconfig.json): TypeScript compiler settings

**Try it:** install with `ext install maxs-lab-of-things.bulk-copy`, then right-click a folder in the Explorer and choose **Copy Structure**.

## Usage

Right-click a folder in the VS Code Explorer and choose **Copy Structure**. Bulk Copy validates that the target is a local folder, walks the folder according to the configured limits, copies the generated text to the clipboard and shows a progress notification while it works.

Open **Bulk Copy: Open Settings** from the Command Palette to jump to the extension's settings. Settings can also be edited in VS Code's Settings UI or in `settings.json`.

## Commands

| Command | Where it appears | What it does |
| --- | --- | --- |
| `bulk-copy.copyStructure` | Explorer folder context menu as **Copy Structure** | copies the selected folder structure to the clipboard |
| `bulk-copy.openSettings` | Command Palette as **Bulk Copy: Open Settings** | opens VS Code settings filtered to Bulk Copy |

## Settings

| Setting | Default | What it controls |
| --- | --- | --- |
| `bulk-copy.maxDepth` | `1` | maximum traversal depth; the code clamps the value between 1 and 20 |
| `bulk-copy.indentCharacter` | `"- "` | text repeated for each indentation level |
| `bulk-copy.indentSize` | `1` | number of indent characters per level; the code clamps the value between 1 and 10 |
| `bulk-copy.includeRootFolder` | `false` | whether to include the selected folder itself before its children |
| `bulk-copy.includeFullPath` | `true` | whether copied entries use absolute paths instead of item names |
| `bulk-copy.pathSeparator` | `"/"` | separator used when formatting paths |
| `bulk-copy.includeFiles` | `true` | whether files appear in the output |
| `bulk-copy.includeFolders` | `true` | whether folders appear in the output |
| `bulk-copy.fileExtensions` | `""` | comma-separated extension filter without dots, such as `js,ts,json`; empty means all files |
| `bulk-copy.includeHidden` | `true` | whether dotfiles and dotfolders are included |
| `bulk-copy.maxItemsPerLevel` | `1000` | maximum entries processed per directory level; the code clamps the value between 100 and 10000 |
| `bulk-copy.maxTotalItems` | `10000` | maximum total entries processed; the code clamps the value between 1000 and 100000 |

Example `settings.json`:

```json
{
  "bulk-copy.maxDepth": 3,
  "bulk-copy.indentCharacter": "# ",
  "bulk-copy.indentSize": 2,
  "bulk-copy.includeRootFolder": false,
  "bulk-copy.includeFullPath": false,
  "bulk-copy.pathSeparator": "/",
  "bulk-copy.includeFiles": true,
  "bulk-copy.includeFolders": true,
  "bulk-copy.fileExtensions": "js,ts,json",
  "bulk-copy.includeHidden": false,
  "bulk-copy.maxItemsPerLevel": 1000,
  "bulk-copy.maxTotalItems": 10000
}
```

## Output examples

Default settings copy immediate children with absolute paths:

```text
- /Users/username/projects/my-project/src
- /Users/username/projects/my-project/tests
- /Users/username/projects/my-project/package.json
- /Users/username/projects/my-project/README.md
```

With full paths disabled and `maxDepth` set to `3`, nested entries are shown by repeated indentation:

```text
- src
- - components
- - - Button.tsx
- - utils
- - - helpers.ts
- tests
- - unit
- - - button.test.ts
```

## Development

The repository includes the scripts `npm run compile`, `npm run watch` and `npm run vscode:prepublish`. They compile the TypeScript extension from `src/` into the extension entry point configured as `./out/extension.js`.

## Links

- [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.bulk-copy)
- [Demo video](https://youtu.be/zXDzlkejjMo)
- [MLoT product page](https://mlot.ai/bulk-copy/)
- [Privacy policy](https://mlot.ai/privacy)
- Publisher: [Max's Lab of Things](https://mlot.ai/)

## License

MIT. See [`LICENSE`](LICENSE).
