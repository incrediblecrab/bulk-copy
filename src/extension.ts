import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface StructureStats {
    fileCount: number;
    folderCount: number;
    maxDepthReached: number;
}

interface StructureOptions {
    maxDepth: number;
    indentChar: string;
    indentSize: number;
    includeRoot: boolean;
    includeFullPath: boolean;
    pathSeparator: string;
    includeFiles: boolean;
    includeFolders: boolean;
    fileExtensions: string[];
    includeHidden: boolean;
    maxItemsPerLevel: number;
    maxTotalItems: number;
}

export function activate(context: vscode.ExtensionContext) {
    // Command to copy structure
    let copyCommand = vscode.commands.registerCommand('bulk-copy.copyStructure', async (uri: vscode.Uri) => {
        try {
            // Validate input
            if (!uri || uri.scheme !== 'file') {
                vscode.window.showErrorMessage('Please right-click on a folder in the Explorer panel');
                return;
            }

            // Check if path exists and is a directory
            let stats: fs.Stats;
            try {
                stats = await fs.promises.stat(uri.fsPath);
            } catch (error) {
                vscode.window.showErrorMessage(`Cannot access path: ${error}`);
                return;
            }

            if (!stats.isDirectory()) {
                vscode.window.showErrorMessage('Please select a folder, not a file');
                return;
            }

            // Get configuration with validation
            const config = vscode.workspace.getConfiguration('bulk-copy');
            // Get and validate configuration values
            const maxItemsPerLevelRaw = config.get<number>('maxItemsPerLevel', 1000);
            const maxTotalItemsRaw = config.get<number>('maxTotalItems', 10000);
            
            const options: StructureOptions = {
                maxDepth: Math.max(1, Math.min(config.get<number>('maxDepth', 1), 20)),
                indentChar: config.get<string>('indentCharacter', '- ') || '- ',
                indentSize: Math.max(1, Math.min(config.get<number>('indentSize', 1), 10)),
                includeRoot: config.get<boolean>('includeRootFolder', false),
                includeFullPath: config.get<boolean>('includeFullPath', true),
                pathSeparator: config.get<string>('pathSeparator', '/') || '/',
                includeFiles: config.get<boolean>('includeFiles', true),
                includeFolders: config.get<boolean>('includeFolders', true),
                fileExtensions: (config.get<string>('fileExtensions', '') || '')
                    .split(',')
                    .map(ext => ext.trim().toLowerCase())
                    .filter(ext => ext.length > 0),
                includeHidden: config.get<boolean>('includeHidden', true),
                maxItemsPerLevel: Math.max(100, Math.min(maxItemsPerLevelRaw, 10000)),
                maxTotalItems: Math.max(1000, Math.min(maxTotalItemsRaw, 100000))
            };

            // Validate at least one type is included
            if (!options.includeFiles && !options.includeFolders) {
                vscode.window.showWarningMessage('Please enable at least files or folders in settings');
                return;
            }

            // Show progress notification
            const folderPath = uri.fsPath;
            const folderName = path.basename(folderPath);
            
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Copying structure...',
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });
                
                const stats: StructureStats = { fileCount: 0, folderCount: 0, maxDepthReached: 0 };
                
                let structure = '';
                
                // Handle root folder display
                if (options.includeRoot) {
                    const rootDisplay = options.includeFullPath ? folderPath : folderName;
                    structure = rootDisplay + '\n';
                    stats.folderCount++;
                }
                
                // Get the structure starting from depth 0 (but will show as depth 1 items)
                const childStructure = await getStructure(
                    folderPath,
                    0,
                    stats,
                    options,
                    progress
                );
                
                structure += childStructure;
                
                if (!structure || structure.trim().length === 0) {
                    vscode.window.showWarningMessage('No items found to copy');
                    return;
                }

                await vscode.env.clipboard.writeText(structure);
                
                const counts = [];
                if (stats.fileCount > 0) counts.push(`${stats.fileCount} files`);
                if (stats.folderCount > 0) counts.push(`${stats.folderCount} folders`);
                const message = `Structure copied (${counts.join(', ')}, depth: ${stats.maxDepthReached}/${options.maxDepth})`;
                
                vscode.window.showInformationMessage(message);
            });
            
        } catch (error) {
            console.error('Bulk Copy extension error:', error);
            vscode.window.showErrorMessage(`Failed to copy structure: ${error}`);
        }
    });

    // Command to open settings
    let settingsCommand = vscode.commands.registerCommand('bulk-copy.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'bulk-copy');
    });

    context.subscriptions.push(copyCommand, settingsCommand);
}

async function getStructure(
    currentPath: string,
    currentDepth: number,
    stats: StructureStats,
    options: StructureOptions,
    progress?: vscode.Progress<{ message?: string; increment?: number }>
): Promise<string> {
    // Stop if we've reached the maximum depth
    if (currentDepth > options.maxDepth) {
        return '';
    }

    // Update max depth reached
    stats.maxDepthReached = Math.max(stats.maxDepthReached, currentDepth);

    let result = '';

    try {
        let items: fs.Dirent[];
        try {
            items = await fs.promises.readdir(currentPath, { withFileTypes: true });
        } catch (error: any) {
            // Handle permission errors gracefully
            if (error.code === 'EACCES' || error.code === 'EPERM') {
                console.warn(`Permission denied: ${currentPath}`);
                return result;
            }
            throw error;
        }

        // Separate and filter items
        const folders = items
            .filter(item => {
                try {
                    return item.isDirectory() && (options.includeHidden || !item.name.startsWith('.'));
                } catch {
                    return false;
                }
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

        const files = items
            .filter(item => {
                try {
                    if (!item.isFile() || (!options.includeHidden && item.name.startsWith('.'))) {
                        return false;
                    }
                    
                    // Check file extension filter
                    if (options.fileExtensions.length > 0) {
                        const ext = path.extname(item.name).toLowerCase().substring(1);
                        return options.fileExtensions.includes(ext);
                    }
                    
                    return true;
                } catch {
                    return false;
                }
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

        // Prevent excessive memory usage
        const totalItems = (options.includeFolders ? folders.length : 0) + (options.includeFiles ? files.length : 0);
        
        if (totalItems > options.maxItemsPerLevel) {
            console.warn(`Limiting items at ${currentPath} to ${options.maxItemsPerLevel} items`);
        }

        // Process folders first
        if (options.includeFolders) {
            const foldersToProcess = folders.slice(0, options.maxItemsPerLevel);
            
            for (const folder of foldersToProcess) {
                const indent = options.indentChar.repeat(options.indentSize * (currentDepth + 1));
                const folderPath = path.join(currentPath, folder.name);
                const displayName = options.includeFullPath ? folderPath : folder.name;
                result += indent + displayName + '\n';
                stats.folderCount++;
                
                // Update progress periodically
                if (progress && (stats.fileCount + stats.folderCount) % 50 === 0) {
                    progress.report({ 
                        message: `Processing ${stats.fileCount + stats.folderCount} items...`,
                        increment: 1 
                    });
                }

                // Check for extremely large structures
                if (stats.fileCount + stats.folderCount > options.maxTotalItems) {
                    console.warn(`Structure exceeds limit of ${options.maxTotalItems} items`);
                    result += indent + options.indentChar.repeat(options.indentSize) + '... (truncated)\n';
                    break;
                }
                
                // Recursively get substructure if not at max depth
                // Since we start at depth 0 for immediate children, we need to adjust:
                // maxDepth 1 = immediate children only (no recursion)
                // maxDepth 2 = immediate children + their children, etc.
                if (currentDepth + 1 < options.maxDepth) {
                    const subStructure = await getStructure(
                        folderPath,
                        currentDepth + 1,
                        stats,
                        options,
                        progress
                    );
                    result += subStructure;
                }
            }
        }

        // Process files
        if (options.includeFiles) {
            const remainingSlots = Math.max(0, options.maxItemsPerLevel - (options.includeFolders ? folders.length : 0));
            const filesToProcess = files.slice(0, remainingSlots);
            
            for (const file of filesToProcess) {
                const indent = options.indentChar.repeat(options.indentSize * (currentDepth + 1));
                const filePath = path.join(currentPath, file.name);
                const displayName = options.includeFullPath ? filePath : file.name;
                result += indent + displayName + '\n';
                stats.fileCount++;
                
                // Update progress periodically
                if (progress && (stats.fileCount + stats.folderCount) % 50 === 0) {
                    progress.report({ 
                        message: `Processing ${stats.fileCount + stats.folderCount} items...`,
                        increment: 1 
                    });
                }

                // Check for extremely large structures
                if (stats.fileCount + stats.folderCount > options.maxTotalItems) {
                    console.warn(`Structure exceeds limit of ${options.maxTotalItems} items`);
                    result += indent + '... (truncated)\n';
                    break;
                }
            }
        }

    } catch (error) {
        console.error(`Error reading directory ${currentPath}:`, error);
        // Continue processing other items
    }

    return result;
}

export function deactivate() {}