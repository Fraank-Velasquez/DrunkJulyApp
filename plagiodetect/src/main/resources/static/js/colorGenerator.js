/**
 * Generador de colores dinámicos para marcas de plagio
 * Genera colores HSL únicos y legibles para cada fuente
 */

class ColorGenerator {
    constructor() {
        this.coloresCache = new Map();
        this.observarModoOscuro();
    }

    /**
     * Observar cambios en el modo oscuro para actualizar colores en tiempo real
     */
    observarModoOscuro() {
        const observer = new MutationObserver(() => {
            this.coloresCache.clear();
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Obtiene el color para una fuente específica
     * @param {number} indice - Índice de la fuente (0, 1, 2, ...)
     * @returns {Object} { fondo, texto } con valores hex
     */
    obtenerColor(indice) {
        if (this.coloresCache.has(indice)) {
            return this.coloresCache.get(indice);
        }

        const isDarkMode = document.body.classList.contains('dark-mode');
        const color = this.generarColorHSL(indice, isDarkMode);

        this.coloresCache.set(indice, color);
        return color;
    }

    /**
     * Genera color HSL basado en índice y modo
     * @param {number} indice - Índice de la fuente
     * @param {boolean} isDarkMode - Si está en modo oscuro
     * @returns {Object} { fondo, texto } con valores hex
     */
    generarColorHSL(indice, isDarkMode) {
        // Distribuye el matiz uniformemente en el espectro (0-360)
        const hue = (indice * 60) % 360;

        let saturation, lightnessBackground, lightnessForeground;

        if (isDarkMode) {
            saturation = 10;
            lightnessBackground = 20;
            lightnessForeground = 50;
        } else {
            saturation = 55;
            lightnessBackground = 90;
            lightnessForeground = 32;
        }

        const hslFondo = `hsl(${hue}, ${saturation}%, ${lightnessBackground}%)`;
        const hslTexto = `hsl(${hue}, ${saturation}%, ${lightnessForeground}%)`;

        return {
            fondo: this.hslToHex(hue, saturation, lightnessBackground),
            texto: this.hslToHex(hue, saturation, lightnessForeground)
        };
    }


    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r = Math.round(255 * f(0));
        const g = Math.round(255 * f(8));
        const b = Math.round(255 * f(4));

        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }

    /**
     * Obtiene color más vibrante/saturado (para barras, iconos, etc)
     * @param {number} indice - Índice de la fuente
     * @returns {string} Color hex más vibrante
     */
    obtenerColorVibrante(indice) {
        const hue = (indice * 60) % 360;
        const saturation = 70;
        const lightness = 55;
        return this.hslToHex(hue, saturation, lightness);
    }

    /**
     * Aplica colores a múltiples elementos
     * @param {Array} elementos - Array de elementos con propiedades { elemento, indice }
     */
    aplicarColoresEnLote(elementos) {
        elementos.forEach(({ elemento, indice }) => {
            this.aplicarColorAlElemento(elemento, indice);
        });
    }
}

const colorGen = new ColorGenerator();
