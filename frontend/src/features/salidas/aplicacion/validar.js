// CAPA: Aplicación
// QUÉ HACE: Validaciones antes de llamar al repositorio
// NO DEBE CONTENER: llamadas HTTP, React, ORM

export const validarCrearSalida = (datos) => {
  const errores = {};
  if (!datos.nombre?.trim())
    errores.nombre = 'El nombre es requerido';
  if (!datos.asignatura?.trim())
    errores.asignatura = 'La asignatura es requerida';
  if (!datos.num_estudiantes || datos.num_estudiantes < 1)
    errores.num_estudiantes = 'Debe tener al menos 1 estudiante';
  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
};
