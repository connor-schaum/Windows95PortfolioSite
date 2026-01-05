const fs = require('fs');
const path = require('path');

// Base directory to scan
const BASE_DIR = path.join(process.cwd(), 'public', 'Connor');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'file-structure.json');

// Windows 95 path separator
const PATH_SEP = '\\';

// Map file extensions to icons
const getFileIcon = (filename, isDirectory) => {
  if (isDirectory) {
    return '📁';
  }
  
  const ext = path.extname(filename).toLowerCase();
  const iconMap = {
    '.pdf': '📄',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.gif': '🖼️',
    '.txt': '📄',
    '.md': '📄',
    '.zip': '📦',
    '.js': '📄',
    '.ts': '📄',
    '.jsx': '📄',
    '.tsx': '📄',
    '.html': '📄',
    '.css': '📄',
  };
  
  return iconMap[ext] || '📄';
};

// Recursively scan directory and build file structure
function scanDirectory(dirPath, win95Path = '', relativePath = '') {
  const items = [];
  
  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    return items;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Sort: folders first, then files, both alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const itemWin95Path = win95Path ? `${win95Path}${PATH_SEP}${entry.name}` : entry.name;
    const itemRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      items.push({
        name: entry.name,
        type: 'folder',
        path: itemWin95Path,
        icon: getFileIcon(entry.name, true)
      });
    } else {
      // Generate URL from relative path (not Windows 95 path)
      const url = `/Connor/${itemRelativePath.replace(/\\/g, '/')}`;
      items.push({
        name: entry.name,
        type: 'file',
        path: itemWin95Path,
        icon: getFileIcon(entry.name, false),
        url: url
      });
    }
  }
  
  return items;
}

// Build the complete file structure
function buildFileStructure() {
  const fileStructure = {};
  
  // Start with root (My Computer -> Local Disk (C:) -> Users -> Connor)
  fileStructure[''] = [
    { name: 'My Computer', type: 'folder', path: 'My Computer', icon: '💻' }
  ];
  
  fileStructure['My Computer'] = [
    { name: 'Local Disk (C:)', type: 'folder', path: 'My Computer\\Local Disk (C:)', icon: '💾' }
  ];
  
  fileStructure['My Computer\\Local Disk (C:)'] = [
    { name: 'Users', type: 'folder', path: 'My Computer\\Local Disk (C:)\\Users', icon: '👥' }
  ];
  
  fileStructure['My Computer\\Local Disk (C:)\\Users'] = [
    { name: 'Connor', type: 'folder', path: 'My Computer\\Local Disk (C:)\\Users\\Connor', icon: '👤' }
  ];
  
  // Scan the actual Connor directory
  const connorPath = 'My Computer\\Local Disk (C:)\\Users\\Connor';
  const connorItems = scanDirectory(BASE_DIR, connorPath, '');
  fileStructure[connorPath] = connorItems;
  
  // Recursively scan subdirectories
  function scanSubdirectories(dirPath, win95Path, relativePath) {
    const fullPath = path.join(BASE_DIR, dirPath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }
    
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subDirPath = path.join(dirPath, entry.name);
        const subWin95Path = `${win95Path}${PATH_SEP}${entry.name}`;
        const subRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        
        const subItems = scanDirectory(
          path.join(BASE_DIR, subDirPath),
          subWin95Path,
          subRelativePath
        );
        
        fileStructure[subWin95Path] = subItems;
        
        // Recursively scan deeper
        scanSubdirectories(subDirPath, subWin95Path, subRelativePath);
      }
    }
  }
  
  // Start scanning from Connor directory
  scanSubdirectories('', connorPath, '');
  
  // Filter out .gitkeep from the Connor directory listing
  if (fileStructure[connorPath]) {
    fileStructure[connorPath] = fileStructure[connorPath].filter(
      item => item.name !== '.gitkeep'
    );
  }
  
  return fileStructure;
}

// Main execution
try {
  console.log('Generating file structure from public/Connor/...');
  
  const fileStructure = buildFileStructure();
  
  // Write to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fileStructure, null, 2));
  
  console.log(`✅ File structure generated successfully!`);
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   Found ${Object.keys(fileStructure).length} directories`);
} catch (error) {
  console.error('❌ Error generating file structure:', error);
  process.exit(1);
}

