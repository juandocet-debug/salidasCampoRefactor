// src/modulos/profesor/componentes/mapa/googleMapsLoader.js
// ─────────────────────────────────────────────────────────────────────────────
// Carga el SDK de Google Maps una sola vez y lo reutiliza.
// ─────────────────────────────────────────────────────────────────────────────
let _promise = null;

export function cargarGoogleMaps() {
    if (_promise) return _promise;

    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key) return Promise.reject(new Error('Falta VITE_GOOGLE_MAPS_KEY'));

    if (window.google?.maps?.places) {
        _promise = Promise.resolve(window.google.maps);
        return _promise;
    }

    _promise = new Promise((resolve, reject) => {
        // Callback global para el script
        window.__gmCallback = () => resolve(window.google.maps);
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=es&region=CO&callback=__gmCallback`;
        script.async = true;
        script.onerror = () => reject(new Error('Error cargando Google Maps'));
        document.head.appendChild(script);
    });

    return _promise;
}
