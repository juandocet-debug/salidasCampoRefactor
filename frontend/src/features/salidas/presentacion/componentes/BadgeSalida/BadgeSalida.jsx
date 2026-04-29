// src/funcionalidades/salidas/componentes/BadgeSalida/BadgeSalida.jsx
// ──────────────────────────────────────────────────────────────────────────
// COMPONENTE ESPECÍFICO del slice Salidas: Badge de estado
//
// Muestra el estado de una salida con el color y texto correctos.
// Usa los tokens del design system existente (variables.css).
// Extiende el patrón de EtiquetaPill que ya existe en ElementosUX.
// ──────────────────────────────────────────────────────────────────────────

import React from 'react';
import './BadgeSalida.css';

/**
 * Mapa de estado → { etiqueta, variante CSS }
 * Variantes disponibles: borrador | enviada | revision | favorable |
 *                        ajuste | aprobada | rechazada | ejecucion |
 *                        finalizada | cerrada | cancelada
 */
const CONFIG = {
  borrador:         { etiqueta: 'Borrador',          variante: 'borrador'   },
  enviada:          { etiqueta: 'Enviada',            variante: 'enviada'    },
  en_revision:      { etiqueta: 'En Revisión',        variante: 'revision'   },
  favorable:        { etiqueta: 'Favorable',          variante: 'favorable'  },
  pendiente_ajuste: { etiqueta: 'Pendiente Ajuste',   variante: 'ajuste'     },
  ajustada:         { etiqueta: 'Ajustada',           variante: 'ajuste'     },
  aprobada:         { etiqueta: 'Aprobada',           variante: 'aprobada'   },
  rechazada:        { etiqueta: 'Rechazada',          variante: 'rechazada'  },
  en_preparacion:   { etiqueta: 'En Preparación',     variante: 'ejecucion'  },
  lista_ejecucion:  { etiqueta: 'Agendada en Logística', variante: 'ejecucion' },
  en_ejecucion:     { etiqueta: 'En Ejecución',       variante: 'ejecucion'  },
  finalizada:       { etiqueta: 'Finalizada',         variante: 'finalizada' },
  cerrada:          { etiqueta: 'Cerrada',            variante: 'cerrada'    },
  cancelada:        { etiqueta: 'Cancelada',          variante: 'cancelada'  },
};

export function BadgeSalida({ estado, className = '' }) {
  const config = CONFIG[estado] ?? { etiqueta: estado, variante: 'borrador' };

  return (
    <span className={`badge-salida badge-salida--${config.variante} ${className}`}>
      {config.etiqueta}
    </span>
  );
}
