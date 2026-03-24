import { create } from 'zustand';

const useAlertas = create((set) => ({
    alertas: [],

    // Método para agregar una alerta
    // tipo = 'exito' | 'error' | 'info' | 'advertencia'
    agregarAlerta: (mensaje, tipo = 'info', duracion = 5000) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

        set((state) => ({
            alertas: [...state.alertas, { id, mensaje, tipo }]
        }));

        if (duracion > 0) {
            setTimeout(() => {
                set((state) => ({
                    alertas: state.alertas.filter((alerta) => alerta.id !== id)
                }));
            }, duracion);
        }
    },

    removerAlerta: (id) => {
        set((state) => ({
            alertas: state.alertas.filter((alerta) => alerta.id !== id)
        }));
    }
}));

export default useAlertas;
