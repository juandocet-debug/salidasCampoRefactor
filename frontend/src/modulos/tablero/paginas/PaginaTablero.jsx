// src/modulos/tablero/paginas/PaginaTablero.jsx
// ─────────────────────────────────────────────────────────────────
// TABLERO PRINCIPAL — Vista inicial después del login.
// Muestra tarjetas de resumen según el rol del usuario.
// El rol 'profesor' tiene un diseño especializado basado en Cards pastel.
// ─────────────────────────────────────────────────────────────────

import useAutenticacion from '../../autenticacion/estado/useAutenticacion';
import TableroProfesor from '../../profesor/paginas/TableroProfesor';
import './PaginaTablero.css';

const tarjetasPorRol = {
    coordinador_academico: [
        { titulo: 'Por Revisar', valor: '5', desc: 'Salidas enviadas', color: 'ambar' },
        { titulo: 'Concluidas', valor: '12', desc: 'Este mes', color: 'verde' },
        { titulo: 'Favorables', valor: '8', desc: 'Concepto emitido', color: 'teal' },
        { titulo: 'Con Ajustes', valor: '4', desc: 'Requieren corrección', color: 'rojo' },
    ],
    coordinador_salidas: [
        { titulo: 'Salidas Aprobadas', valor: '6', desc: 'En preparación', color: 'teal' },
        { titulo: 'Vehículos Listos', valor: '3', desc: 'Disponibles', color: 'verde' },
        { titulo: 'En Ejecución', valor: '1', desc: 'En este momento', color: 'cyan' },
        { titulo: 'Presupuesto Total', valor: '$2.4M', desc: 'Este semestre', color: 'ambar' },
    ],
    conductor: [
        { titulo: 'Mi Asignación', valor: '1', desc: 'Salida próxima', color: 'teal' },
        { titulo: 'Checklist', valor: '15', desc: 'Ítems pendientes', color: 'ambar' },
        { titulo: 'Novedades', valor: '0', desc: 'En el viaje', color: 'verde' },
    ],
    consejo: [
        { titulo: 'Por Decidir', valor: '3', desc: 'Pendientes', color: 'ambar' },
        { titulo: 'Aprobadas', valor: '18', desc: 'Este semestre', color: 'verde' },
        { titulo: 'Rechazadas', valor: '2', desc: 'Este semestre', color: 'rojo' },
    ],
    estudiante: [
        { titulo: 'Mi Salida', valor: '1', desc: 'Próxima salida', color: 'teal' },
        { titulo: 'Documentos', valor: '2/4', desc: 'Subidos / Requeridos', color: 'ambar' },
        { titulo: 'Mi Código', valor: '—', desc: 'Disponible el día', color: 'cyan' },
    ],
    admin_sistema: [
        { titulo: 'Usuarios', valor: '524', desc: 'Activos en el sistema', color: 'teal' },
        { titulo: 'Roles', valor: '6', desc: 'Operativos', color: 'ambar' },
        { titulo: 'Auditoría', valor: '100%', desc: 'Salud del sistema', color: 'verde' },
        { titulo: 'Errores', valor: '0', desc: 'Alertas hoy', color: 'rojo' },
    ],
};

/* ── TABLERO PROFESOR MOVED TO modulos/profesor/paginas/TableroProfesor.jsx ── */

export default function PaginaTablero() {
    const usuario = useAutenticacion(s => s.usuario);
    const nombre = usuario?.nombre?.split(' ')[0] || 'Usuario';

    // RENDERIZADO DEDICADO PARA PROFESOR
    if (usuario?.rol === 'profesor') {
        return <TableroProfesor />;
    }

    // RENDERIZADO PARA OTROS ROLES (Fallback)
    const tarjetas = tarjetasPorRol[usuario?.rol] || [];
    return (
        <div className="tablero">
            {/* Bienvenida */}
            <div className="tablero__bienvenida">
                <h1 className="tablero__saludo">Bienvenido, <span>{nombre}</span> 👋</h1>
                <p className="tablero__fecha">
                    {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="tablero__grid">
                {tarjetas.map((t) => (
                    <div key={t.titulo} className={`tablero__tarjeta tablero__tarjeta--${t.color}`}>
                        <div className="tablero__tarjeta-valor">{t.valor}</div>
                        <div className="tablero__tarjeta-titulo">{t.titulo}</div>
                        <div className="tablero__tarjeta-desc">{t.desc}</div>
                    </div>
                ))}
            </div>

            {/* Acceso rápido */}
            <div className="tablero__seccion-titulo">Accesos rápidos</div>
            <div className="tablero__accesos" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <div style={{ background: 'white', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>📋 Ver mis salidas</div>
                <div style={{ background: 'white', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>➕ Nueva solicitud</div>
            </div>
        </div>
    );
}
