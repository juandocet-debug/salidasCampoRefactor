// src/modulos/profesor/componentes/logistica/enriquecerPueblosData.js
// Extraido de buscarPueblos.js para cumplir con Clean Code

export async function enriquecerPueblos(pueblos) {
    const sinEnriquecer = pueblos.filter(p => !p._enriquecido);
    if (!sinEnriquecer.length) return pueblos;

    const enriquecidos = await Promise.all(sinEnriquecer.map(async (p) => {
        try {
            const q = `${p.nombre} ${p.depto || ''} Colombia`;
            const sd = await (await fetch(
                `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=1`
            )).json();
            const title = sd?.query?.search?.[0]?.title;
            if (!title) throw new Error('no result');
            const sd2 = await (await fetch(
                `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
            )).json();
            return {
                ...p,
                foto: sd2?.thumbnail?.source || null,
                descripcion: sd2?.extract ? sd2.extract.slice(0, 240) + '…' : `Municipio a ~${p.kmDesdeOrigen}km del origen.`,
                wikiUrl: sd2?.content_urls?.desktop?.page || null,
                _enriquecido: true,
            };
        } catch {
            return { ...p, descripcion: `Municipio a ~${p.kmDesdeOrigen}km del origen${p.depto ? `, ${p.depto}` : ''}.`, _enriquecido: true };
        }
    }));

    const porId = Object.fromEntries(enriquecidos.map(e => [e.id, e]));
    return pueblos.map(p => porId[p.id] ?? p);
}
