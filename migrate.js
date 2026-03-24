const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');
const utilsDir = path.join(srcDir, 'ui/profesor/salidas/componentes/logistica/utils');
const hooksDir = path.join(srcDir, 'ui/profesor/salidas/componentes/logistica/hooks');
const dominioDir = path.join(srcDir, 'salidas/dominio');
const appDir = path.join(srcDir, 'salidas/aplicacion');

// Create necessary directories
fs.mkdirSync(hooksDir, { recursive: true });
fs.mkdirSync(dominioDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });

// Read all source files
const validaciones = fs.readFileSync(path.join(utilsDir, 'validacionesSalida.js'), 'utf8');
const rutaUtils = fs.readFileSync(path.join(utilsDir, 'rutaUtils.js'), 'utf8');
const hotelUtils = fs.readFileSync(path.join(utilsDir, 'hotelUtils.js'), 'utf8');
const diccionario = fs.readFileSync(path.join(utilsDir, 'rutasConocidasDiccionario.js'), 'utf8');
const helpers = fs.readFileSync(path.join(utilsDir, 'helpersSalida.js'), 'utf8');

const buscarEnRuta = fs.readFileSync(path.join(utilsDir, 'buscarEnRuta.js'), 'utf8');
const buscarApis = fs.readFileSync(path.join(utilsDir, 'buscarEnRutaApis.js'), 'utf8');
const buscarPueblos = fs.readFileSync(path.join(utilsDir, 'buscarPueblos.js'), 'utf8');
const enriquecer = fs.readFileSync(path.join(utilsDir, 'enriquecerPueblosData.js'), 'utf8');

// Concatenate pure logic for reglas.js
const reglasContent = `// src/salidas/dominio/reglas.js
// ─────────────────────────────────────────────────────────────────────────────
// REGLAS DE NEGOCIO (Cálculos puros, transformaciones, validaciones)
// ─────────────────────────────────────────────────────────────────────────────

${validaciones.replace(/export /g, 'export ')}
${hotelUtils.replace(/export /g, 'export ')}
${diccionario.replace(/export /g, 'export ')}
${rutaUtils.replace(/export async function geocodificar[\s\S]*\}\n/m, '')}
${helpers.replace(/export async function cargarSalidaParaEdicion[\s\S]*?export async function enviarSalida[\s\S]*?export function parsearErrorDRF/m, 'export function parsearErrorDRF').replace(/import axios from 'axios';\nimport \{ API_URL \} from '@\/compartido\/api\/config';\n/g, '')}
`.replace(/import.*['"].*['"];\n/g, ''); // strip relative imports between themselves

fs.writeFileSync(path.join(dominioDir, 'reglas.js'), reglasContent);

// Contatenate APIs/Services for servicios.js
const geocodificarFn = rutaUtils.match(/export async function geocodificar[\s\S]*\}\n/m)?.[0] || '';
const backendHelpersFn = helpers.match(/export async function cargarSalidaParaEdicion[\s\S]*?(?=export function parsearErrorDRF)/m)?.[0] || '';

const serviciosContent = `// src/salidas/aplicacion/servicios.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS Y ORQUESTACIÓN (Llamadas a API, integraciones)
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import { API_URL } from '@/compartido/api/config';
import * as reglas from '@/salidas/dominio/reglas';

const distanciaKm = reglas.distanciaKm;
const distanciaMinAlaRuta = reglas.distanciaMinAlaRuta;
const buscarEnDiccionario = reglas.buscarEnDiccionario;

${geocodificarFn}
${buscarApis}
${buscarEnRuta.replace(/import { fetchGooglePlaces, fetchNominatim }.*$/m, '')}
${buscarPueblos}
${enriquecer}
${backendHelpersFn}
`.replace(/import.*utils.*(?:\n|$)/gm, '');

fs.writeFileSync(path.join(appDir, 'servicios.js'), serviciosContent);

// Move React Hooks to hooks directory
const moveHooks = ['LogisticaHooks.js', 'useAccionesRuta.js', 'usePuntosRuta.js', 'useRutaIA.js'];
moveHooks.forEach(hook => {
    let content = fs.readFileSync(path.join(utilsDir, hook), 'utf8');
    content = content.replace(/@\/ui\/profesor\/salidas\/componentes\/logistica\/utils\/(?!use)[^'"]+/g, '@/salidas/dominio/reglas');
    content = content.replace(/import \{.*\} from '@\/salidas\/dominio\/reglas';/g, match => {
        // Here we might need to split imports if some are from servicios
        if (match.includes('geocodificar')) {
            return match.replace('geocodificar', '') + "\\nimport { geocodificar } from '@/salidas/aplicacion/servicios';";
        }
        return match;
    });
    content = content.replace(/@\/ui\/profesor\/salidas\/componentes\/logistica\/utils\/use/g, '@/ui/profesor/salidas/componentes/logistica/hooks/use');
    
    // special replacements for usePuntosRuta
    if(hook === 'usePuntosRuta.js') {
        content = content.replace(/import (.*) from '@\/salidas\/dominio\/reglas';/, "import $1 from '@/salidas/dominio/reglas';\\nimport { geocodificar } from '@/salidas/aplicacion/servicios';");
    }
    fs.writeFileSync(path.join(hooksDir, hook), content);
});

// Delete files from utils
const allUtils = fs.readdirSync(utilsDir);
allUtils.forEach(file => fs.unlinkSync(path.join(utilsDir, file)));
try { fs.rmdirSync(utilsDir); } catch(e){} // Delete folder if empty

console.log('Migration complete');
