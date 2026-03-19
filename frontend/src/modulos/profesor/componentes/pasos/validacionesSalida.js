/**
 * Validaciones de cada paso del formulario de Nueva Salida.
 * Retorna null si todo OK, o un string con el mensaje de error.
 */
export function validarPaso(pasoActivo, form) {
    if (pasoActivo === 1) {
        if (!form.nombre.trim()) return "El nombre de la salida es obligatorio.";
        if (!form.asignatura.trim()) return "La asignatura es obligatoria.";
        if (!form.semestre.trim()) return "El semestre es obligatorio.";
        if (!form.facultad.trim()) return "La facultad es obligatoria (Ej: Ciencias).";
        if (!form.programa.trim()) return "El programa es obligatorio (Ej: Biología).";
        if (!form.num_estudiantes || parseInt(form.num_estudiantes) < 1) return "El número de estudiantes debe ser mayor a 0.";
        if (!form.fecha_inicio) return "La fecha de inicio es obligatoria.";
        if (!form.fecha_fin) return "La fecha de finalización es obligatoria.";
        if (!form.justificacion.trim()) return "La justificación académica es obligatoria.";
    }
    if (pasoActivo === 2) {
        if (!form.objetivo_general.trim()) return "El objetivo general es obligatorio.";
        if (!form.objetivos_especificos.trim()) return "Liste al menos dos objetivos específicos.";
        if (!form.estrategia_metodologica.trim()) return "Especifique una estrategia metodológica.";
    }
    if (pasoActivo === 3) {
        if (!form.punto_partida.trim()) return "El punto de partida es obligatorio.";
        if (!form.parada_max.trim()) return "Especifique el lugar de destino o ruta máx.";
        if (form._requiereHospedaje) return "El viaje excede 10 horas. Debe agregar una parada de hospedaje antes de continuar.";
    }
    return null; // OK
}
