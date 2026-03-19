// src/modulos/profesor/componentes/logistica/buscarEnRutaApis.js
import { distanciaKm } from './hotelUtils';

export async function fetchGooglePlaces(qText, centro, isHotel, KEY, MAX_RADIO) {
    let dataMap = [];
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.priceLevel'
        },
        body: JSON.stringify({
            textQuery: qText,
            languageCode: 'es',
            locationBias: {
                circle: {
                    center: { latitude: centro.lat, longitude: centro.lng },
                    radius: Math.min(MAX_RADIO * 1000, 50000)
                }
            }
        })
    });

    if (res.ok) {
        const gData = await res.json();
        if (gData.places) {
            dataMap = gData.places.map(p => {
                let pLevel = -1;
                if (p.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') pLevel = 0;
                else if (p.priceLevel === 'PRICE_LEVEL_MODERATE') pLevel = 1;
                else if (p.priceLevel === 'PRICE_LEVEL_EXPENSIVE') pLevel = 2;
                else if (p.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') pLevel = 3;

                let costoBase;
                if (isHotel) {
                    if (pLevel === 0) costoBase = 90000;
                    else if (pLevel === 1) costoBase = 180000;
                    else if (pLevel === 2) costoBase = 350000;
                    else if (pLevel === 3) costoBase = 700000;
                    else {
                        const r = p.rating || 3.5;
                        costoBase = Math.floor(r * 40000) + (p.displayName?.text?.length || 10) * 2000;
                    }
                } else {
                    if (pLevel >= 0) {
                        costoBase = [20000, 38000, 80000, 160000][pLevel];
                    } else {
                        const r = p.rating || 3.5;
                        costoBase = Math.min(Math.floor(r * 7000) + 10000, 38000);
                    }
                }

                return {
                    placeId: p.id,
                    nombre: p.displayName?.text || p.formattedAddress?.split(',')[0] || qText,
                    lat: p.location?.latitude,
                    lng: p.location?.longitude,
                    direccion: p.formattedAddress || '',
                    rating: p.rating || 0,
                    totalResenas: p.userRatingCount || 0,
                    foto: p.photos?.length > 0
                        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=300&maxWidthPx=300&key=${KEY}`
                        : '',
                    precioAprox: `~ $${costoBase.toLocaleString('es-CO')} COP`,
                    costoBase,
                };
            });
        }
    }
    return dataMap;
}

export async function fetchNominatim(qText, centro, delta, NOMINATIM) {
    let dataMap = [];
    const params = new URLSearchParams({
        q: qText, format: 'json', limit: '10',
        countrycodes: 'co',
        viewbox: `${centro.lng - delta},${centro.lat + delta},${centro.lng + delta},${centro.lat - delta}`,
        bounded: '1',
        'accept-language': 'es',
    });
    try {
        const res = await fetch(`${NOMINATIM}?${params}`, {
            headers: { 'User-Agent': 'OTIUM-Salidas/1.0' },
        });
        if (res.ok) {
            const nData = await res.json();
            dataMap = nData.map(r => ({
                placeId: `${r.lat}_${r.lon}`,
                nombre: r.display_name.split(',')[0].trim(),
                lat: parseFloat(r.lat),
                lng: parseFloat(r.lon),
                direccion: r.display_name.split(',').slice(1, 3).join(',').trim(),
                rating: 0,
                totalResenas: 0,
                foto: '',
                precioAprox: null,
                costoBase: null,
            }));
        }
    } catch { /* skip */ }
    return dataMap;
}
