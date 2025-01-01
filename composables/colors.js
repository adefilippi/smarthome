export function hslaToHex(h, s, l, a) {
    // Convertir la saturation et la luminosité en fraction
    s /= 100;
    l /= 100;

    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const x = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - chroma / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = chroma;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = chroma;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = chroma;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = chroma;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = chroma;
    } else if (h >= 300 && h < 360) {
        r = chroma;
        g = 0;
        b = x;
    }

    // Convertir en [0, 255]
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // Convertir l'alpha (0 à 1) en hexadécimal (0 à 255)
    const alpha = Math.round(a * 255);

    // Retourner en format `#RRGGBBAA`
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}${alpha.toString(16).padStart(2, '0').toUpperCase()}`;
}

export function hexToHsla(hex) {
    // Vérifie si le format est valide (ex. #RRGGBBAA)
    if (hex.length !== 9) {
        throw new Error('Le format hexadécimal doit être #RRGGBBAA pour inclure un canal alpha.');
    }

    // Convertir Hex en RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Convertir Hex en Alpha
    const a = parseInt(hex.slice(7, 9), 16) / 255;

    // Calculer la teinte (h), la saturation (s), et la luminosité (l)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r:
                h = ((g - b) / delta) % 6;
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    s = +(s * 100).toFixed(1); // Saturation en pourcentage
    l = +(l * 100).toFixed(1); // Luminosité en pourcentage
    a = +a.toFixed(2);         // Alpha entre 0 et 1 avec 2 décimales

    return { h, s, l, a };
}