
/* ── Datos de ejemplo */
const DATOS_EJEMPLO = {
    porcentajePlagio: 23,
    totalPalabras: 312,
    fuentes: [
        {
            nombre: 'tesis_economia_2023.pdf',
            tipo: 'pdf',
            url: null,
            porcentaje: 12,
            fragmentoCoincidente: 'El análisis macroeconómico evidencia una correlación directa entre las tasas de interés y el comportamiento del consumo interno',
            fragmentosEnTexto: [
                'evidencia una correlación directa entre las tasas de interés',
                'comportamiento del consumo interno',
            ]
        },
        {
            nombre: 'wikipedia.org',
            tipo: 'web',
            url: 'https://es.wikipedia.org/wiki/Macroeconomia',
            porcentaje: 7,
            fragmentoCoincidente: 'La macroeconomía estudia el comportamiento y funcionamiento de una economía en su conjunto',
            fragmentosEnTexto: [
                'La macroeconomía estudia el comportamiento y funcionamiento',
            ]
        },
        {
            nombre: 'revista_academica_utp.docx',
            tipo: 'word',
            url: null,
            porcentaje: 4,
            fragmentoCoincidente: 'Los modelos econométricos permiten proyectar escenarios de crecimiento sostenido',
            fragmentosEnTexto: [
                'modelos econométricos permiten proyectar escenarios',
            ]
        },
    ],
    textoOriginal: `La macroeconomía estudia el comportamiento y funcionamiento de una economía en su conjunto, considerando variables agregadas como el producto interno bruto, el empleo y los niveles de precios.

El análisis macroeconómico evidencia una correlación directa entre las tasas de interés y el comportamiento del consumo interno de los hogares y las empresas.

Los modelos econométricos permiten proyectar escenarios de crecimiento sostenido en contextos de estabilidad monetaria y fiscal adecuada.

La política fiscal expansiva puede estimular la demanda agregada en períodos de recesión económica, siempre que se mantenga un nivel de deuda pública sostenible a largo plazo.`
};


document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que colorGen esté disponible
    if (typeof colorGen !== 'undefined') {
        renderizarResultado(DATOS_EJEMPLO);
    } else {
        const checkColorGen = setInterval(() => {
            if (typeof colorGen !== 'undefined') {
                clearInterval(checkColorGen);
                renderizarResultado(DATOS_EJEMPLO);
            }
        }, 100);
    }
});

/**
 * Punto de entrada principal.
 * Llamar con los datos reales del backend.
 * @param {Object} datos
 */
function renderizarResultado(datos) {
    actualizarTarjetasResumen(datos);
    construirBarraDesglose(datos.fuentes, datos.porcentajePlagio);
    construirLeyendaColores(datos.fuentes);
    construirTextoHighlighted(datos.textoOriginal, datos.fuentes);
    construirListaFuentes(datos.fuentes);
    actualizarContadorFuentes(datos.fuentes.length);
}

function actualizarTarjetasResumen(datos) {
    const pct = datos.porcentajePlagio;
    const totalPalab = datos.totalPalabras;

    animarContador('numeroPlagio', pct);
    animarContador('numeroFuentes', datos.fuentes.length);
    animarContador('numeroPalabras', totalPalab);
    animarContador('numeroOriginal', 100 - pct);

    // Nivel de riesgo
    const elNivel = document.getElementById('nivelPlagio');
    if (elNivel) {
        const { texto, color } = calcularNivelRiesgo(pct);
        elNivel.textContent = texto;
        elNivel.style.color = color;
    }

    // Medidor circular SVG
    animarMedidorCircular(pct);
}

function calcularNivelRiesgo(pct) {
    if (pct <= 10) return { texto: 'Bajo riesgo', color: '#10b981' };
    if (pct <= 25) return { texto: 'Riesgo medio', color: '#f59f0bda' };
    if (pct <= 50) return { texto: 'Riesgo alto', color: '#ef4444' };
    return { texto: 'Crítico', color: '#991b1b' };
}

function animarMedidorCircular(pct) {
    const circulo = document.getElementById('circuloPlagio');
    const numEl = document.getElementById('numeroPlagio');
    if (!circulo) return;

    const circunferencia = 314;
    const offset = circunferencia - (pct / 100) * circunferencia;

    // Color según riesgo
    const color = pct <= 10 ? '#10b981ee' : pct <= 25 ? '#f59f0b8e' : '#ef4444';
    circulo.style.stroke = color;

    setTimeout(() => {
        circulo.style.strokeDashoffset = offset;
    }, 200);

    // Contador numérico animado
    animarContadorDirecto(numEl, pct, 1400);
}


function construirBarraDesglose(fuentes, porcentajeTotal) {
    const contenedorBarra = document.getElementById('barraDesglose');
    const contenedorLeyenda = document.getElementById('leyendaDesglose');
    if (!contenedorBarra) return;

    contenedorBarra.innerHTML = '';
    contenedorLeyenda.innerHTML = '';

    // Segmento original
    const pctOriginal = 100 - porcentajeTotal;
    agregarSegmento(contenedorBarra, pctOriginal, '#e5e7eb', 'original');
    agregarItemLeyenda(contenedorLeyenda, 'Contenido original', '#898f99', pctOriginal);

    // Segmentos por fuente
    fuentes.forEach((fuente, i) => {
        let colorSegmento = '#999999';
        if (typeof colorGen !== 'undefined') {
            colorSegmento = colorGen.obtenerColorVibrante(i);
        }
        agregarSegmento(contenedorBarra, fuente.porcentaje, colorSegmento, `fuente-${i}`);
        agregarItemLeyenda(contenedorLeyenda, fuente.nombre, colorSegmento, fuente.porcentaje);
    });
}

function agregarSegmento(contenedor, pct, color, id) {
    const seg = document.createElement('div');
    seg.className = 'segmento-barra';
    seg.style.background = color;
    seg.style.width = '0%';
    seg.dataset.id = id;
    contenedor.appendChild(seg);
    requestAnimationFrame(() => {
        setTimeout(() => { seg.style.width = pct + '%'; }, 100);
    });
}

function agregarItemLeyenda(contenedor, nombre, color, pct) {
    const item = document.createElement('div');
    item.className = 'leyenda-item';
    item.innerHTML = `
        <span class="leyenda-punto" style="background:${color}"></span>
        <span>${recortarNombre(nombre, 22)} · <strong>${pct}%</strong></span>
    `;
    contenedor.appendChild(item);
}

function construirLeyendaColores(fuentes) {
    const contenedor = document.getElementById('leyendaColores');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    fuentes.forEach((fuente, i) => {
        let color = { fondo: '#f0f0f0', texto: '#333333' };
        if (typeof colorGen !== 'undefined') {
            color = colorGen.obtenerColor(i);
        }

        const pastilla = document.createElement('span');
        pastilla.className = 'pastilla-leyenda';
        pastilla.textContent = recortarNombre(fuente.nombre, 18);
        pastilla.style.background = color.fondo;
        pastilla.style.color = color.texto;
        pastilla.dataset.indice = i;
        pastilla.title = fuente.nombre;

        pastilla.addEventListener('click', () => filtrarPorFuente(i));
        contenedor.appendChild(pastilla);
    });
}


function construirTextoHighlighted(textoOriginal, fuentes) {
    const contenedor = document.getElementById('textoAnalizado');
    if (!contenedor) return;

    const mapaReemplazos = {};
    fuentes.forEach((fuente, i) => {
        fuente.fragmentosEnTexto.forEach(frag => {
            mapaReemplazos[frag] = i;
        });
    });

    let textoHtml = textoOriginal;

    textoHtml = escaparHtml(textoHtml);

    Object.entries(mapaReemplazos).forEach(([fragmento, indice]) => {
        const fragmentoEsc = escaparHtml(fragmento);

        let marca;

        if (typeof colorGen !== 'undefined') {
            const color = colorGen.obtenerColor(indice);
            marca = `<span class="marca-plagio" data-fuente="${indice}" style="--fuente-bg: ${color.fondo}; --fuente-text: ${color.texto};" title="Coincidencia con: ${escaparAtributo(fuentes[indice].nombre)}">${fragmentoEsc}</span>`;
        } else {
            marca = `<span class="marca-plagio" data-fuente="${indice}" title="Coincidencia con: ${escaparAtributo(fuentes[indice].nombre)}">${fragmentoEsc}</span>`;
        }

        textoHtml = textoHtml.replace(fragmentoEsc, marca);
    });

    textoHtml = textoHtml.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    contenedor.innerHTML = `<p>${textoHtml}</p>`;

    contenedor.querySelectorAll('.marca-plagio').forEach(marca => {
        marca.addEventListener('click', () => {
            const indice = parseInt(marca.dataset.fuente);
            activarFuente(indice);
        });
    });
}


function construirListaFuentes(fuentes) {
    const lista = document.getElementById('listaFuentes');
    if (!lista) return;
    lista.innerHTML = '';

    fuentes.forEach((fuente, i) => {
        let color, colorBorde;
        if (typeof colorGen !== 'undefined') {
            color = colorGen.obtenerColor(i);
            colorBorde = calcularColorBorde(color.fondo);
        } else {
            color = { fondo: '#f0f0f0', texto: '#333333' };
            colorBorde = '#999999';
        }

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-fuente';
        tarjeta.dataset.indice = i;
        tarjeta.style.borderLeftColor = colorBorde;
        tarjeta.style.animationDelay = `${i * 80}ms`;

        const iconoTipo = fuente.tipo === 'pdf' ? 'bi-file-earmark-pdf'
            : fuente.tipo === 'web' ? 'bi-globe'
                : fuente.tipo === 'word' ? 'bi-file-earmark-word'
                    : 'bi-file-earmark';

        tarjeta.innerHTML = `<div class="fuente-cabecera"><div class="fuente-nombre"><i class="bi ${iconoTipo}" style="color:${colorBorde}"></i><span title="${fuente.nombre}">${recortarNombre(fuente.nombre, 28)}</span></div><span class="fuente-porcentaje" style="background:${color.fondo}; color:${color.texto};">${fuente.porcentaje}%</span></div><div class="fuente-fragmento" style="background:${color.fondo}; border-color:${colorBorde}; color:${color.texto};">${fuente.fragmentoCoincidente}</div><div class="fuente-pie">${fuente.url ? `<a href="${fuente.url}" class="fuente-url" target="_blank" rel="noopener">${fuente.url}</a>` : `<span class="fuente-url">Documento interno</span>`}<span class="fuente-coincidencias">${fuente.fragmentosEnTexto.length} coincidencia${fuente.fragmentosEnTexto.length !== 1 ? 's' : ''}</span></div>`;

        tarjeta.addEventListener('click', () => activarFuente(i));
        lista.appendChild(tarjeta);
    });
}

function actualizarContadorFuentes(total) {
    const el = document.getElementById('fuentesContador');
    if (el) el.textContent = `${total} coincidencia${total !== 1 ? 's' : ''}`;
}

/*  Resalta en texto y tarjeta al hacer clic */
let indiceFuenteActiva = null;

function activarFuente(indice) {
    // Si ya está activa, desactivar (toggle)
    if (indiceFuenteActiva === indice) {
        desactivarFuentes();
        return;
    }
    indiceFuenteActiva = indice;

    // Texto: atenuar todas excepto las del índice activo
    document.querySelectorAll('.marca-plagio').forEach(marca => {
        const estaFuente = parseInt(marca.dataset.fuente) === indice;
        marca.classList.toggle('activa', estaFuente);
        marca.classList.toggle('atenuada', !estaFuente);
    });

    // Tarjetas: resaltar la activa
    document.querySelectorAll('.tarjeta-fuente').forEach(tarjeta => {
        tarjeta.classList.toggle('activa', parseInt(tarjeta.dataset.indice) === indice);
    });

    // Scroll automático a la tarjeta activa
    const tarjetaActiva = document.querySelector(`.tarjeta-fuente[data-indice="${indice}"]`);
    tarjetaActiva?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Scroll a la primera marca en el texto
    const primeraMarca = document.querySelector(`.marca-plagio[data-fuente="${indice}"]`);
    primeraMarca?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function desactivarFuentes() {
    indiceFuenteActiva = null;
    document.querySelectorAll('.marca-plagio').forEach(m => {
        m.classList.remove('activa', 'atenuada');
    });
    document.querySelectorAll('.tarjeta-fuente').forEach(t => {
        t.classList.remove('activa');
    });
}

function filtrarPorFuente(indice) {
    activarFuente(indice);
}

/**
 * Calcula un color de borde oscuro basado en el color de fondo
 * Se usa para bordes de tarjetas y elementos visuales
 * @param {string} colorFondo - Color en formato hex
 * @returns {string} Color oscuro en formato hex
 */
function calcularColorBorde(colorFondo) {
    // Extraer valores RGB del color hex
    const r = parseInt(colorFondo.slice(1, 3), 16);
    const g = parseInt(colorFondo.slice(3, 5), 16);
    const b = parseInt(colorFondo.slice(5, 7), 16);

    // Calcular luminancia
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Si es claro, oscurecer; si es oscuro, aclarar
    const factor = lum > 0.5 ? 0.6 : 1.4;

    const rNew = Math.round(r * factor).toString(16).padStart(2, '0');
    const gNew = Math.round(g * factor).toString(16).padStart(2, '0');
    const bNew = Math.round(b * factor).toString(16).padStart(2, '0');

    return `#${rNew}${gNew}${bNew}`;
}
function animarContador(idElemento, valorFinal, duracion = 1200) {
    const el = document.getElementById(idElemento);
    if (!el) return;
    const htmlExtra = el.innerHTML.replace(/^\d+/, '');
    animarContadorDirecto(el, valorFinal, duracion, htmlExtra);
}

function animarContadorDirecto(el, valorFinal, duracion = 1200, htmlExtra = '') {
    if (!el) return;
    const inicio = performance.now();

    const paso = (ahora) => {
        const transcurrido = ahora - inicio;
        const progreso = Math.min(transcurrido / duracion, 1);
        const easeOut = 1 - Math.pow(1 - progreso, 3);
        el.innerHTML = Math.round(easeOut * valorFinal) + htmlExtra;
        if (progreso < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
}

function recortarNombre(nombre, maxChars) {
    if (nombre.length <= maxChars) return nombre;
    const ext = nombre.includes('.') ? '.' + nombre.split('.').pop() : '';
    const corte = maxChars - ext.length - 1;
    return nombre.substring(0, corte) + '…' + ext;
}

function escaparHtml(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escaparAtributo(texto) {
    return texto.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}