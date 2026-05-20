const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

export const mobileAuthService = {
    login: async (correo, password) => {
        const res = await fetch(`${API_URL}/auth/mobile/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correo.trim().toLowerCase(), password })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Credenciales inválidas');
        }

        return data.datos; // { usuario, access, refresh }
    },
    cambiarPassword: async (nuevaPassword, token) => {
        const res = await fetch(`${API_URL}/auth/mobile/cambiar-password/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nueva_password: nuevaPassword })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Error al cambiar contraseña');
        }

        return data; // { message, access, usuario }
    }
};
