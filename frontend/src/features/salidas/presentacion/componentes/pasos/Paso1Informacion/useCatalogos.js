import { useState, useEffect } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';

export function useCatalogos() {
    const [facultades, setFacultades] = useState([]);
    const [programas,  setProgramas]  = useState([]);
    const [ventanas,   setVentanas]   = useState([]);
    const [cargando,   setCargando]   = useState(true);

    useEffect(() => {
        clienteHttp.get('/api/admin/catalogos/')
            .then(res => {
                const d = res.data;
                if (d.ok && d.datos) {
                    setFacultades(d.datos.facultades || []);
                    setProgramas(d.datos.programas  || []);
                    setVentanas(d.datos.ventanas    || []);
                }
            })
            .catch(() => {})
            .finally(() => setCargando(false));
    }, []);

    return { facultades, programas, ventanas, cargando };
}
