// rutasConocidasDiccionario.js
// DICCIONARIO: Rutas colombianas conocidas para fallback extra-rápido

export const RUTAS_CONOCIDAS = {
    // Bogotá → Medellín vía Honda / Magdalena Medio
    'bogota_medellin': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['medell'],
        municipios: [
            { nombre: 'Mosquera', depto: 'Cundinamarca' },
            { nombre: 'Funza', depto: 'Cundinamarca' },
            { nombre: 'Madrid', depto: 'Cundinamarca' },
            { nombre: 'Facatativá', depto: 'Cundinamarca' },
            { nombre: 'Albán', depto: 'Cundinamarca' },
            { nombre: 'Villeta', depto: 'Cundinamarca' },
            { nombre: 'Guaduas', depto: 'Cundinamarca' },
            { nombre: 'Honda', depto: 'Tolima' },
            { nombre: 'La Dorada', depto: 'Caldas' },
            { nombre: 'Puerto Triunfo', depto: 'Antioquia' },
            { nombre: 'Doradal', depto: 'Antioquia' },
            { nombre: 'Puerto Nare', depto: 'Antioquia' },
            { nombre: 'Maceo', depto: 'Antioquia' },
            { nombre: 'Cisneros', depto: 'Antioquia' },
            { nombre: 'Santo Domingo', depto: 'Antioquia' },
            { nombre: 'Barbosa', depto: 'Antioquia' },
            { nombre: 'Copacabana', depto: 'Antioquia' },
            { nombre: 'Bello', depto: 'Antioquia' },
        ],
    },
    // Medellín → Bogotá (sentido inverso)
    'medellin_bogota': {
        aliases_ori: ['medell'],
        aliases_dst: ['bogot', 'bogotá'],
        municipios: [
            { nombre: 'Bello', depto: 'Antioquia' },
            { nombre: 'Copacabana', depto: 'Antioquia' },
            { nombre: 'Barbosa', depto: 'Antioquia' },
            { nombre: 'Santo Domingo', depto: 'Antioquia' },
            { nombre: 'Cisneros', depto: 'Antioquia' },
            { nombre: 'Maceo', depto: 'Antioquia' },
            { nombre: 'Puerto Nare', depto: 'Antioquia' },
            { nombre: 'Puerto Triunfo', depto: 'Antioquia' },
            { nombre: 'Doradal', depto: 'Antioquia' },
            { nombre: 'La Dorada', depto: 'Caldas' },
            { nombre: 'Honda', depto: 'Tolima' },
            { nombre: 'Guaduas', depto: 'Cundinamarca' },
            { nombre: 'Villeta', depto: 'Cundinamarca' },
            { nombre: 'Albán', depto: 'Cundinamarca' },
            { nombre: 'Facatativá', depto: 'Cundinamarca' },
            { nombre: 'Madrid', depto: 'Cundinamarca' },
            { nombre: 'Funza', depto: 'Cundinamarca' },
        ],
    },
    // Bogotá → Cali vía Espinal / Girardot
    'bogota_cali': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['cali', 'vale', 'valle'],
        municipios: [
            { nombre: 'Soacha', depto: 'Cundinamarca' },
            { nombre: 'Sibaté', depto: 'Cundinamarca' },
            { nombre: 'Fusagasugá', depto: 'Cundinamarca' },
            { nombre: 'Melgar', depto: 'Tolima' },
            { nombre: 'Flandes', depto: 'Tolima' },
            { nombre: 'Espinal', depto: 'Tolima' },
            { nombre: 'Guamo', depto: 'Tolima' },
            { nombre: 'Purificación', depto: 'Tolima' },
            { nombre: 'Neiva', depto: 'Huila' },
            { nombre: 'Campoalegre', depto: 'Huila' },
            { nombre: 'Hobo', depto: 'Huila' },
            { nombre: 'La Plata', depto: 'Huila' },
            { nombre: 'Popayán', depto: 'Cauca' },
            { nombre: 'Santander de Quilichao', depto: 'Cauca' },
            { nombre: 'Palmira', depto: 'Valle del Cauca' },
        ],
    },
    // Bogotá → Cartagena vía Bucaramanga / Costa
    'bogota_cartagena': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['cartagena', 'bolívar', 'bolivar'],
        municips: [
            { nombre: 'Tunja', depto: 'Boyacá' },
            { nombre: 'Duitama', depto: 'Boyacá' },
            { nombre: 'Sogamoso', depto: 'Boyacá' },
            { nombre: 'Aguazul', depto: 'Casanare' },
            { nombre: 'Bucaramanga', depto: 'Santander' },
            { nombre: 'Barrancabermeja', depto: 'Santander' },
            { nombre: 'San Alberto', depto: 'César' },
            { nombre: 'Aguachica', depto: 'César' },
            { nombre: 'El Banco', depto: 'Magdalena' },
            { nombre: 'Magangué', depto: 'Bolívar' },
        ]
    },
    // Bogotá → Bucaramanga
    'bogota_bucaramanga': {
        aliases_ori: ['bogot', 'bogotá'],
        aliases_dst: ['bucaramanga', 'santander'],
        municipios: [
            { nombre: 'Tunja', depto: 'Boyacá' },
            { nombre: 'Barbosa', depto: 'Santander' },
            { nombre: 'Vélez', depto: 'Santander' },
            { nombre: 'Socorro', depto: 'Santander' },
            { nombre: 'San Gil', depto: 'Santander' },
            { nombre: 'Aratoca', depto: 'Santander' },
            { nombre: 'Los Santos', depto: 'Santander' },
            { nombre: 'Floridablanca', depto: 'Santander' },
        ],
    },
};

export function buscarEnDiccionario(oriNombre, dstNombre) {
    if (!oriNombre || !dstNombre) return null;
    const ori = oriNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dst = dstNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [, ruta] of Object.entries(RUTAS_CONOCIDAS)) {
        const matchOri = ruta.aliases_ori.some(a => ori.includes(a));
        const matchDst = ruta.aliases_dst.some(a => dst.includes(a));
        if (matchOri && matchDst) return ruta.municipios || ruta.municips;
    }
    return null;
}
