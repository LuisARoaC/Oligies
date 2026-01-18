const flyer = document.getElementById('flyer-canvas');
const loader = document.getElementById('loader');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');
const btnRefresh = document.getElementById('btn-refresh');

// DICCIONARIO DE ÓRDENES (IDs seleccionados manualmente de Picsum)
const bibliotecaIA = {
    "moda": [157, 334, 338, 445, 829],
    "tecnologia": [0, 1, 2, 3, 370, 449],
    "naturaleza": [10, 11, 28, 54, 103, 116],
    "comida": [429, 488, 493, 1080, 1060],
    "ciudad": [1031, 1040, 122, 367, 382]
};

function generarImagenIA() {
    const texto = inputTitle.value.toLowerCase();
    let idSeleccionado = null;
    
    // Mostrar loader
    loader.style.display = "block";
    flyer.style.opacity = "0.8";

    // Lógica de detección de palabras
    if (texto.includes("moda") || texto.includes("ropa")) {
        idSeleccionado = elegirId(bibliotecaIA.moda);
    } else if (texto.includes("tecnologia") || texto.includes("computador") || texto.includes("ia")) {
        idSeleccionado = elegirId(bibliotecaIA.tecnologia);
    } else if (texto.includes("naturaleza") || texto.includes("viaje") || texto.includes("paisaje")) {
        idSeleccionado = elegirId(bibliotecaIA.naturaleza);
    } else if (texto.includes("comida") || texto.includes("hamburguesa") || texto.includes("cafe")) {
        idSeleccionado = elegirId(bibliotecaIA.comida);
    } else if (texto.includes("ciudad") || texto.includes("edificio") || texto.includes("urbano")) {
        idSeleccionado = elegirId(bibliotecaIA.ciudad);
    } else {
        // ID aleatorio si no hay coincidencia
        idSeleccionado = Math.floor(Math.random() * 1000);
    }

    const imgUrl = `https://picsum.photos/id/${idSeleccionado}/800/1000`;
    
    // Precarga de imagen para evitar parpadeos
    const tempImg = new Image();
    tempImg.src = imgUrl;
    tempImg.onload = () => {
        flyer.style.backgroundImage = `url('${imgUrl}')`;
        loader.style.display = "none";
        flyer.style.opacity = "1";
    };
}

function elegirId(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// Eventos
inputTitle.addEventListener('input', (e) => {
    displayTitle.innerText = e.target.value || "Tu Título Aquí";
    
    // Espera 800ms después de que el usuario deja de escribir para cambiar la imagen
    clearTimeout(window.iaTimer);
    window.iaTimer = setTimeout(generarImagenIA, 800);
});

inputSubtitle.addEventListener('input', (e) => {
    displaySubtitle.innerText = e.target.value || "Slogan o descripción breve";
});

btnRefresh.addEventListener('click', generarImagenIA);

// Inicio
generarImagenIA();

