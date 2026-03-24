const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');
const featuresDir = path.join(srcDir, 'features');

function moveDir(src, dest) {
    if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        
        // Use copy + remove to avoid EPERM on Windows if files are open
        fs.cpSync(src, dest, { recursive: true });
        try {
            fs.rmSync(src, { recursive: true, force: true });
        } catch (err) {
            console.warn(`Could not delete original directory ${src}: ${err.message}`);
        }
    }
}

// 1. Create features/
fs.mkdirSync(featuresDir, { recursive: true });

// 2. Move Logic
const slicesInfo = ['abordaje', 'checklist', 'novedades', 'salidas'];

slicesInfo.forEach(slice => {
    moveDir(path.join(srcDir, slice), path.join(featuresDir, slice));
});

// 3. Rename infraestructura to api/
slicesInfo.forEach(slice => {
    const infraPath = path.join(featuresDir, slice, 'infraestructura');
    const apiPath = path.join(featuresDir, slice, 'api');
    if (fs.existsSync(infraPath)) {
        fs.renameSync(infraPath, apiPath);
    }
});

// 4. Move UI to presentacion
moveDir(path.join(srcDir, 'ui/conductor/abordaje'), path.join(featuresDir, 'abordaje/presentacion'));
moveDir(path.join(srcDir, 'ui/conductor/checklist'), path.join(featuresDir, 'checklist/presentacion'));
moveDir(path.join(srcDir, 'ui/conductor/novedades'), path.join(featuresDir, 'novedades/presentacion'));
moveDir(path.join(srcDir, 'ui/profesor/salidas'), path.join(featuresDir, 'salidas/presentacion'));

// 5. Huérfanos
moveDir(path.join(srcDir, 'ui/autenticacion'), path.join(featuresDir, 'auth/presentacion'));
moveDir(path.join(srcDir, 'ui/tablero'), path.join(featuresDir, 'tablero/presentacion'));
moveDir(path.join(srcDir, 'ui/admin'), path.join(featuresDir, 'admin_sistema/presentacion'));

// 6. Rename compartido to shared
moveDir(path.join(srcDir, 'compartido'), path.join(srcDir, 'shared'));

// 7. Eliminar src/ui/
const uiDir = path.join(srcDir, 'ui');
if (fs.existsSync(uiDir)) {
    fs.rmSync(uiDir, { recursive: true, force: true });
}

// 8. Fix global imports
function updateImportsInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateImportsInDir(fullPath);
        } else if (/\.(jsx?|tsx?|css)$/.test(file)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Absolute alias replacements
            content = content.replace(/@\/ui\/conductor\/abordaje/g, '@/features/abordaje/presentacion');
            content = content.replace(/@\/ui\/conductor\/checklist/g, '@/features/checklist/presentacion');
            content = content.replace(/@\/ui\/conductor\/novedades/g, '@/features/novedades/presentacion');
            content = content.replace(/@\/ui\/profesor\/salidas/g, '@/features/salidas/presentacion');
            
            content = content.replace(/@\/ui\/autenticacion/g, '@/features/auth/presentacion');
            content = content.replace(/@\/ui\/tablero/g, '@/features/tablero/presentacion');
            content = content.replace(/@\/ui\/admin/g, '@/features/admin_sistema/presentacion');
            
            // Other logic slices
            content = content.replace(/@\/abordaje/g, '@/features/abordaje');
            content = content.replace(/@\/checklist/g, '@/features/checklist');
            content = content.replace(/@\/novedades/g, '@/features/novedades');
            
            content = content.replace(/@\/salidas\/infraestructura/g, '@/features/salidas/api');
            content = content.replace(/@\/salidas/g, '@/features/salidas');
            
            // Shared
            content = content.replace(/@\/compartido/g, '@/shared');

            // Catch any remaining direct imports containing 'ui/' just in case
            // If they point to 'ui/other' we might want to flag them, but the user said "borralos" or the UI dir won't exist.
            
            // Relative replacements containing 'compartido' since folder is renamed
            content = content.replace(/(from|import)['"\s]+([\.\/]+)compartido\//g, "$1 '$2shared/");

            // Any remaining @/ui mapped to @/features/tablero/presentacion as fallback, or we can just leave it to error check
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

updateImportsInDir(srcDir);
// Also update App.jsx if it wasn't matched properly or has different syntax
console.log('Migración completa ✅');
