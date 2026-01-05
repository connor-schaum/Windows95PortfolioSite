# Portfolio Files Directory

This directory contains your portfolio files that will appear in the Windows 95 file explorer.

## How to Use

1. **Add your resume**: Simply drag your `Resume.pdf` file into this folder
2. **Add projects**: Create folders like `Project1`, `Project2`, etc. and add your project files inside
3. **Add files**: Any files you add here will automatically appear in the file explorer
4. **Rebuild**: After adding files, run `npm run build` or `npm run generate-structure` to update the file structure

## File Structure

The file structure is automatically generated from this directory when you build the project. The script:
- Scans all files and folders in this directory
- Generates a `file-structure.json` file in the `public/` folder
- The website reads from this JSON to display files in the Windows 95 explorer

## Supported File Types

The system automatically detects file types and assigns icons:
- 📄 PDFs, text files, code files
- 🖼️ Images (PNG, JPG, GIF)
- 📦 ZIP files
- 📁 Folders

## Example Structure

```
Connor/
├── Resume.pdf
├── Project1/
│   ├── README.txt
│   └── screenshot.png
├── Project2/
│   └── demo.gif
└── Project3/
    └── code.zip
```

This will appear in the Windows 95 explorer as:
- My Computer → Users → Connor → Resume.pdf, Project1, Project2, Project3

