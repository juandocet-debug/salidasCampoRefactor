import { useState, useEffect } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';

export function useFlotaDisponible() {
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlota = async () => {
            try {
                setCargando(true);
                const res = await clienteHttp.get('/api/transporte/vehiculos/');
                const data = res.data;
                
                // Extraer arreglo y filtrar disponibles
                const lista = data.datos || data || [];
                const disponibles = lista.filter(v => v.estado_tecnico === 'disponible');
                setVehiculos(disponibles);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchFlota();
    }, []);

    return { vehiculos, cargando, error };
}
