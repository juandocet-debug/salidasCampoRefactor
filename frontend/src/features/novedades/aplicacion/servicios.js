// CAPA: Aplicación
// Orquestación de casos de uso para novedades

import * as repo from '@/features/novedades/api/repositorio';

export async function reportarNovedad(salidaId, datos) {
    try {
        return await repo.reportarNovedad(salidaId, datos);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'Error al reportar la novedad.');
    }
}

export async function listarNovedades(salidaId) {
    try {
        return await repo.listarNovedades(salidaId);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'Error al obtener novedades.');
    }
}
