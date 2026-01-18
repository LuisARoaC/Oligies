const flyer = document.getElementById('flyer-canvas');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');

// DICCIONARIO DE TEMAS (IDs seleccionados de Picsum para Flyers)
const temasPicsum = {
    "moda": [157, 334, 338, 445],
    "tecnologia": [0, 1, 2, 370, 449],
    "naturaleza": [10, 11, 28, 54, 103],
    "comida": [429, 488, 493, 1080],
    "deporte": [1077, 1084, 73],
    "arquitectura": [1031, 1040, 122],
    "default": [237, 433, 566] // Perros y texturas
};

function actualizarFlyerPorOrden() {
    const texto = inputTitle.value.toLowerCase();
    let idSeleccionado = null;

    // Lógica de "Orden Directa"
    if (texto.includes("moda") || texto.includes("ropa")) {
        idSeleccionado = obtenerIdAzar(temasPicsum.moda);
    } else if (texto.includes("pc") || texto.includes("web") || texto.includes("tecnologia")) {
        idSeleccionado = obtenerIdAzar(temasPicsum.tecnologia);
    } else if (texto.includes("viaje") || texto.includes("campo") || texto.includes("naturaleza")) {
        idSeleccionado = obtenerIdAzar(temasPicsum.naturaleza);
    } else if (texto.includes("hamburguesa") || texto.includes("comida") || texto.includes("restaurante")) {
        idSeleccionado = obtenerIdAzar(temasPicsum.comida);
    } else {
        // Si no detecta palabra clave, da una imagen profesional aleatoria
        idSeleccionado = Math.floor(Math.random() * 500);
    }

    // Aplicar la orden a Picsum
    const url = `https://picsum.photos/id/${idSeleccionado}/800/1000`;
    flyer.style.backgroundImage = `url('${url}')`;
}

function obtenerIdAzar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// Eventos para que reaccione al escribir
inputTitle.addEventListener('input', (e) => {
    displayTitle.innerText = e.target.value;
    // Solo cambia la imagen si el usuario deja de escribir un momento (para no saturar)
    clearTimeout(window.espera);
    window.espera = setTimeout(actualizarFlyerPorOrden, 1000);
});

inputSubtitle.addEventListener('input', (e) => {
    displaySubtitle.innerText = e.target.value;
});

// Carga inicial
actualizarFlyerPorOrden();

