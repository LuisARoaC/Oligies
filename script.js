const flyer = document.getElementById('flyer-preview');
const loader = document.getElementById('loader');
const inputPrompt = document.getElementById('input-prompt');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');

const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');

let imageReady = null;

// Sincronizar textos en tiempo real
inputTitle.addEventListener('input', () => displayTitle.innerText = inputTitle.value || "Título");
inputSubtitle.addEventListener('input', () => displaySubtitle.innerText = inputSubtitle.value || "Subtítulo");

// 1. GENERAR IMAGEN
document.getElementById('btn-generate').addEventListener('click', () => {
    const prompt = inputPrompt.value;
    if (!prompt) return alert("Por favor, describe la imagen que quieres.");

    loader.style.display = "block";
    
    // Creamos la URL mágica de Pollinations
    // Agregamos un número aleatorio al final para que no repita la misma imagen
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=800&height=1000&nologo=true`;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Vital para poder descargarla después
    
    img.onload = () => {
        imageReady = img;
        flyer.style.backgroundImage = `url('${imageUrl}')`;
        loader.style.display = "none";
    };

    img.onerror = () => {
        alert("Error al conectar con la IA. Intenta de nuevo.");
        loader.style.display = "none";
    };

    img.src = imageUrl;
});

// 2. DESCARGAR TODO JUNTO
document.getElementById('btn-download').addEventListener('click', () => {
    if (!imageReady) return alert("Primero genera una imagen.");

    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');

    // Dibujar imagen de fondo
    ctx.drawImage(imageReady, 0, 0, canvas.width, canvas.height);

    // Capa oscura para que el texto resalte
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estilo de texto
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    
    // Título
    ctx.font = "bold 70px Arial";
    ctx.fillText(inputTitle.value.toUpperCase() || "TÍTULO", canvas.width / 2, canvas.height / 2);

    // Subtítulo
    ctx.font = "40px Arial";
    ctx.fillText(inputSubtitle.value || "Subtítulo", canvas.width / 2, (canvas.height / 2) + 70);

    // Descargar
    const link = document.createElement('a');
    link.download = `mi-flyer-ia.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});
