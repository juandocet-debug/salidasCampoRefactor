// CAPA: Aplicación
// Orquestación de casos de uso para checklist

import * as repo from '@/features/checklist/api/repositorio';

export async function obtenerChecklist(salidaId) {
    try {
        return await repo.obtenerChecklist(salidaId);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'Error al obtener el checklist.');
    }
}

export async function guardarChecklist(salidaId, items) {
    try {
        return await repo.guardarChecklist(salidaId, items);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'Error al guardar el checklist.');
    }
}
