import { confirmarAbordaje, listarAbordaje, activarCodigo } from '@/features/abordaje/api/repositorio';

export async function verificarCodigoAbordajeServicio(salidaId, codigo) {
    try {
        return await confirmarAbordaje(salidaId, codigo);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'Código inválido o expirado.');
    }
}

export async function obtenerResumenAbordajeServicio(salidaId) {
    try {
        return await listarAbordaje(salidaId);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'No se pudo cargar el estado de abordaje.');
    }
}

export async function activarCodigoAbordaje(salidaId, foto = '') {
    try {
        return await activarCodigo(salidaId, foto);
    } catch (e) {
        throw new Error(e?.response?.data?.error || 'No se pudo generar el código.');
    }
}
