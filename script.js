const flyer = document.getElementById('flyer-canvas');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');
const btnRefresh = document.getElementById('btn-refresh');

// Función para actualizar la imagen basada en el texto
function updateImageByKeyword() {
    // Tomamos la primera palabra del título o del subtítulo
    const keyword = inputTitle.value.split(" ")[0] || inputSubtitle.value.split(" ")[0] || "abstract";
    
    // Usamos Source Unsplash para buscar por tema
    // Formato: https://source.unsplash.com/featured/800x1000?palabra-clave
    const imageUrl = `https://source.unsplash.com/featured/800x1000?${encodeURIComponent(keyword)}`;
    
    // Mostramos un efecto de carga
    flyer.style.opacity = "0.7";
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        flyer.style.backgroundImage = `url('${imageUrl}')`;
        flyer.style.opacity = "1";
    };
}

// Actualizar texto en tiempo real
inputTitle.addEventListener('input', (e) => {
    displayTitle.innerText = e.target.value || "Tu Título Aquí";
});

inputSubtitle.addEventListener('input', (e) => {
    displaySubtitle.innerText = e.target.value || "Slogan o descripción breve";
});

// Cuando el usuario termine de escribir (al quitar el foco) o pulse el botón
inputTitle.addEventListener('blur', updateImageByKeyword);
btnRefresh.addEventListener('click', updateImageByKeyword);

// Carga inicial
updateImageByKeyword();

