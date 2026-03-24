// CAPA: Dominio
// QUÉ HACE: Enums y constantes del módulo salidas (espejo del backend)
// NO DEBE CONTENER: llamadas HTTP, React, estado

export const EstadoSalida = {
  BORRADOR:          'borrador',
  ENVIADA:           'enviada',
  EN_REVISION:       'en_revision',
  FAVORABLE:         'favorable',
  PENDIENTE_AJUSTE:  'pendiente_ajuste',
  AJUSTADA:          'ajustada',
  APROBADA:          'aprobada',
  RECHAZADA:         'rechazada',
  EN_PREPARACION:    'en_preparacion',
  EN_EJECUCION:      'en_ejecucion',
  FINALIZADA:        'finalizada',
  CERRADA:           'cerrada',
  CANCELADA:         'cancelada',
};

export const ESTADOS_ACTIVOS = [
  EstadoSalida.BORRADOR,
  EstadoSalida.ENVIADA,
  EstadoSalida.EN_REVISION,
  EstadoSalida.FAVORABLE,
  EstadoSalida.PENDIENTE_AJUSTE,
  EstadoSalida.AJUSTADA,
  EstadoSalida.APROBADA,
  EstadoSalida.EN_PREPARACION,
  EstadoSalida.EN_EJECUCION,
];

export const ESTADOS_TERMINALES = [
  EstadoSalida.FINALIZADA,
  EstadoSalida.CERRADA,
  EstadoSalida.CANCELADA,
  EstadoSalida.RECHAZADA,
];
