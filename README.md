# Bulk Copy

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.bulk-copy)
![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

A lightweight VS Code extension that allows you to copy file and folder structures with customizable formatting.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/bulk-copy.gif)

## Features

- Right-click any folder to copy its immediate contents (files and folders)
- Configurable depth limit for deeper traversal (default: 1 = immediate children only)
- Customizable indentation characters (-, #, *, etc.)
- Adjustable indentation size
- Option to include/exclude files or folders
- Option to include/exclude hidden files (starting with .)
- File extension filtering (e.g., only .js, .ts files)
- Option to show full paths or relative names
- Safe defaults with configurable performance limits
- Progress notifications for large operations

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Search for "Bulk Copy"
4. Click Install

### From VSIX file
1. Download the `bulk-copy-1.5.0.vsix` file
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Type "Extensions: Install from VSIX..."
5. Select the downloaded `.vsix` file
6. Reload VS Code when prompted

### Manual Installation
1. Open VS Code
2. Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Click the "..." menu at the top of the Extensions view
4. Choose "Install from VSIX..."
5. Navigate to and select the `bulk-copy-0.0.1.vsix` file

## Usage

1. Right-click on any folder in the VS Code Explorer
2. Select "Copy Structure" from the context menu
3. The immediate contents are copied to your clipboard (depth 1 by default)
4. Paste anywhere with `Cmd+V` (Mac) or `Ctrl+V` (Windows/Linux)

## How to Change Settings

### Method 1: Command Palette (Fastest)
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Bulk Copy: Open Settings"
3. Press Enter to open the settings directly

### Method 2: VS Code Settings UI
1. Open VS Code Settings (`Cmd+,` on Mac or `Ctrl+,` on Windows/Linux)
2. Search for "bulk copy"
3. Adjust the settings using the UI controls
4. Changes take effect immediately

### Method 3: Settings JSON
1. Open VS Code Settings (`Cmd+,` or `Ctrl+,`)
2. Click the "Open Settings (JSON)" icon in the top right
3. Add your customizations:
```json
{
  "bulk-copy.maxDepth": 3,
  "bulk-copy.indentCharacter": "# ",
  "bulk-copy.indentSize": 2,
  "bulk-copy.includeRootFolder": false,
  "bulk-copy.includeFullPath": true,
  "bulk-copy.pathSeparator": "/",
  "bulk-copy.includeFiles": true,
  "bulk-copy.includeFolders": true,
  "bulk-copy.fileExtensions": "js,ts,json",
  "bulk-copy.includeHidden": true,
  "bulk-copy.maxItemsPerLevel": 1000,
  "bulk-copy.maxTotalItems": 10000
}
```

## Extension Settings

### Core Settings

* **`bulk-copy.maxDepth`** (number, default: 1, range: 1-20)
  - **Purpose**: Controls how deep into the folder structure to traverse
  - **Use Cases**: 
    - `1` (default): Shows only immediate children - perfect for quick overviews
    - `2-3`: Good for seeing project organization without overwhelming detail
    - `4+`: Deep traversal for complete project mapping
  - **Example**: With depth 2, you'll see `src/` and `src/components/` but not files inside components

* **`bulk-copy.includeFullPath`** (boolean, default: true)
  - **Purpose**: Shows absolute paths (`/Users/name/project/file.js`) vs relative names (`file.js`)
  - **Use Cases**:
    - `true`: Essential for scripts, configurations, or when you need exact file locations
    - `false`: Cleaner output for documentation or visual structure
  - **Example**: Copying paths for build scripts or IDE configurations

### Visual Formatting

* **`bulk-copy.indentCharacter`** (string, default: "- ")
  - **Purpose**: Customizes the visual hierarchy indicator
  - **Popular Options**:
    - `"- "` (default): Clean markdown-style lists
    - `"* "`: Alternative bullet style
    - `"# "`: Heading-style for emphasis
    - `"│ "`: Tree-style vertical lines
    - `"  "`: Minimal indentation only
  - **Note**: Always include a space after your character for readability

* **`bulk-copy.indentSize`** (number, default: 1, range: 1-10)
  - **Purpose**: Controls how many indent characters per nesting level
  - **Use Cases**:
    - `1` (default): Compact view
    - `2-3`: More visual separation between levels
    - `4+`: Very pronounced hierarchy (useful for deeply nested structures)

### Content Filtering

* **`bulk-copy.includeFiles`** (boolean, default: true)
  - **Purpose**: Toggle whether to include files in the output
  - **Use Case**: Set to `false` for folder-only structure views

* **`bulk-copy.includeFolders`** (boolean, default: true)
  - **Purpose**: Toggle whether to include folders in the output
  - **Use Case**: Set to `false` to list only files (useful for file audits)

* **`bulk-copy.fileExtensions`** (string, default: "")
  - **Purpose**: Filter files by extension types
  - **Format**: Comma-separated, no dots (e.g., `"js,ts,jsx,tsx"`)
  - **Use Cases**:
    - `"js,ts"`: Show only JavaScript/TypeScript files
    - `"md,txt,doc"`: Documentation files only
    - `""` (empty): Include all file types
  - **Example**: Finding all test files with `"test.js,spec.js"`

* **`bulk-copy.includeHidden`** (boolean, default: true)
  - **Purpose**: Include/exclude files and folders starting with `.`
  - **Use Cases**:
    - `true` (default): See everything including `.git`, `.env`, `.vscode`
    - `false`: Hide system/config files for cleaner output
  - **Security Note**: Be careful when sharing output containing `.env` or other sensitive hidden files

### Display Options

* **`bulk-copy.includeRootFolder`** (boolean, default: false)
  - **Purpose**: Whether to include the selected folder itself in the output
  - **Use Cases**:
    - `false` (default): Focus on contents only
    - `true`: Include parent folder name for context

* **`bulk-copy.pathSeparator`** (string, default: "/")
  - **Purpose**: Character used to separate path segments
  - **Options**:
    - `"/"` (default): Unix/Mac/Linux style, works everywhere
    - `"\\"`: Windows style (requires double backslash)
    - `" > "`: Visual breadcrumb style

### Performance & Safety Limits

* **`bulk-copy.maxItemsPerLevel`** (number, default: 1000, range: 100-10000)
  - **Purpose**: Prevents memory issues by limiting items per directory
  - **When to Adjust**:
    - Decrease if VS Code slows down in large directories
    - Increase if you need to copy directories with many files
  - **Impact**: Directories exceeding this limit will be truncated with "..."

* **`bulk-copy.maxTotalItems`** (number, default: 10000, range: 1000-100000)
  - **Purpose**: Global safety limit to prevent VS Code from crashing
  - **Guidelines**:
    - `10,000` (default): Safe for most projects
    - `25,000`: Medium projects with good performance
    - `50,000`: Large projects (monitor VS Code memory)
    - `100,000`: Maximum (use with caution, may freeze VS Code)
  - **Warning**: Processing stops when this limit is reached

## Example Outputs

### Default settings (depth 1, full paths):
```
- /Users/username/projects/my-project/src
- /Users/username/projects/my-project/tests
- /Users/username/projects/my-project/package.json
- /Users/username/projects/my-project/README.md
- /Users/username/projects/my-project/.gitignore
- /Users/username/projects/my-project/tsconfig.json
```

### With depth 3 (deeper traversal):
```
- src
- - components
- - - Button.tsx
- - - Header.tsx
- - utils
- - - helpers.ts
- - - constants.ts
- tests
- - unit
- - - button.test.ts
- - integration
- - - api.test.ts
- package.json
- README.md
```

### With relative names (full paths disabled):
```
- src
- tests
- package.json
- README.md
- .gitignore
- tsconfig.json
```

### Folders only (depth 2):
```
- src
- - components
- - utils
- tests
- - unit
- - integration
- docs
```

### Files only with extension filter (js,ts) at depth 1:
```
- index.js
- app.ts
- config.js
```

## Use Cases

- **Quick Overview**: Get immediate folder contents without deep nesting
- **Documentation**: Copy project structure for README files
- **Code Reviews**: Share folder organization with team members
- **Project Planning**: Visualize and plan directory structures
- **File Audits**: List all files of specific types
- **Path References**: Get full paths for configuration files or scripts

## Tips & Best Practices

### Performance
- Start with default settings (depth 1, 10K total items) and increase as needed
- Monitor VS Code's memory usage when working with large projects
- Use file extension filters to reduce output size
- If VS Code becomes unresponsive, restart and lower the limits

### Security
- Be cautious when sharing output that includes hidden files (`.env`, `.git`, etc.)
- Review output before sharing to ensure no sensitive paths are exposed
- Consider setting `includeHidden: false` when creating public documentation

### Common Workflows
1. **Quick Overview**: Use defaults (depth 1, full paths)
2. **Documentation**: Set `includeFullPath: false` and adjust depth as needed
3. **File Audit**: Set `includeFolders: false` and use extension filters
4. **Project Structure**: Increase depth to 2-3, exclude files for cleaner view
5. **Build Scripts**: Keep full paths enabled for accurate references

## Troubleshooting

- **No output copied**: Check that at least one of `includeFiles` or `includeFolders` is true
- **Missing items**: Verify `includeHidden` setting and check file permissions
- **Truncated output**: Increase `maxItemsPerLevel` or `maxTotalItems` settings
- **VS Code freezing**: Reduce depth and limit settings, restart VS Code

## Requirements

- VS Code version 1.74.0 or higher
- No additional dependencies required

## Known Issues

None at this time. Please report any issues you encounter.

## Release Notes

### 1.5.0 - Standardization Update
- Standardizing and adding media

### 0.0.1 - Initial Release
- Copy file and folder structures with right-click
- Configurable depth, formatting, and filtering options
- Safe defaults with performance limits
- Full path and relative name support
- Hidden file inclusion options
- Progress notifications for large operations

## Resources

- 📺 [Watch Demo Video](https://youtu.be/zXDzlkejjMo)
- 🌐 [Visit MLoT Page](https://mlot.ai/bulk-copy/)
- 🔒 [Privacy Policy](https://mlot.ai/privacy)

## Publisher

**Max's Lab of Things**
Visit [mlot.ai](https://mlot.ai/)

## License

MIT
