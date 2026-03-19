// src/modulos/profesor/componentes/mapa/PantallaParadaHelpers.js

export const MOTIVOS = [
    { value: '', label: 'Seleccione…' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'refrigerio', label: 'Refrigerio' },
    { value: 'bano', label: 'Baño' },
    { value: 'actividad_academica', label: 'Actividad Académica' },
    { value: 'recoger_pasajero', label: 'Recoger Pasajero' },
    { value: 'hospedaje', label: 'Hospedaje / Pernoctar' },
    { value: 'descanso_nocturno', label: 'Descanso Nocturno' },
    { value: 'otro', label: 'Otro' },
];

export const MOTIVOS_CON_BUSQUEDA = ['almuerzo', 'refrigerio', 'hospedaje', 'descanso_nocturno'];
export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const PORTADAS_PARADA = [
    { id: 'https://i.ibb.co/NgB0jYxL/pngtree-eco-friendly-adventurestips-for-a-green-vacation-png-image-15617281.png', label: 'Eco Aventura' },
    { id: 'https://i.ibb.co/7tBcjjMW/pngtree-personal-assistant-planning-an-ecofriendly-vacation-png-image-12695420.png', label: 'Asistente Eco' },
    { id: 'https://i.ibb.co/gZC3m3sV/sustainable-tourism-ecotourism-eco-friendly-recreation-vector-removebg-preview.png', label: 'Globo Sostenible' }
];

export const COLORES_PARADA = [
    { hex: '#64748b', label: 'Base Pizarra' },
    { hex: '#3b82f6', label: 'Azul Info' },
    { hex: '#f59e0b', label: 'Ámbar Comida' },
    { hex: '#10b981', label: 'Esmeralda Eco' },
    { hex: '#ec4899', label: 'Rosa Pink' },
    { hex: '#8b5cf6', label: 'Violeta' }
];

export const INICIAL = {
    nombre: '', motivo: '', motivoOtro: '',
    tiempoCantidad: '', tiempoUnidad: 'min',
    actividad: '', lat: null, lng: null, ubicacion: '',
    fechaProgramada: '', horaProgramada: '', notasItinerario: '',
    icono: '', color: '',
};

export function parsearTiempoGuardado(t) {
    if (!t) return { cantidad: '', unidad: 'min' };
    const m = t.match(/(\d+\.?\d*)\s*(h|hora|horas)/i);
    if (m) return { cantidad: m[1], unidad: 'horas' };
    const m2 = t.match(/(\d+\.?\d*)/);
    return { cantidad: m2 ? m2[1] : '', unidad: 'min' };
}

export function generarRangoFechas(inicio, fin) {
    if (!inicio) return [];
    const fechas = [];
    const d1 = new Date(inicio + 'T00:00:00');
    const d2 = fin ? new Date(fin + 'T00:00:00') : d1;
    for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
        fechas.push(new Date(d));
    }
    return fechas;
}

export function fmtPill(date) { return `${date.getDate()} ${MESES[date.getMonth()]}`; }
export function fmtISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function fmtHumano(s) {
    if (!s) return ''; const [y,m,d] = s.split('-').map(Number);
    return `${d} ${MESES[m-1]} ${y}`;
}
export function fmtHora(s) {
    if (!s) return ''; const [h,m] = s.split(':');
    const hora = parseInt(h,10); return `${hora%12||12}:${m} ${hora>=12?'PM':'AM'}`;
}
