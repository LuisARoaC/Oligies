const flyer = document.getElementById('flyer-canvas');
const btnRefresh = document.getElementById('btn-refresh');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');

// Función para obtener imagen aleatoria de Picsum
function updateBackground() {
    const randomId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/id/${randomId}/800/1000`;
    
    // Aplicar la imagen al contenedor
    flyer.style.backgroundImage = `url('${imageUrl}')`;
}

// Actualizar texto en tiempo real
inputTitle.addEventListener('input', (e) => {
    displayTitle.innerText = e.target.value || "Tu Título Aquí";
});

inputSubtitle.addEventListener('input', (e) => {
    displaySubtitle.innerText = e.target.value || "Slogan o descripción breve";
});

// Evento de clic para nueva imagen
btnRefresh.addEventListener('click', updateBackground);

// Cargar imagen inicial
updateBackground();

