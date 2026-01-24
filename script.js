const flyer = document.getElementById('flyer-preview');
const loader = document.getElementById('loader');
const inputPrompt = document.getElementById('input-prompt');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');

// Elementos visuales
const contTitle = document.getElementById('cont-title');
const contSubtitle = document.getElementById('cont-subtitle');
const dispTitle = document.getElementById('display-title');
const dispSubtitle = document.getElementById('display-subtitle');

let imageReady = null;
let showTitle = true;
let showSubtitle = true;

// --- SINCRONIZACIÓN ---
inputTitle.addEventListener('input', () => dispTitle.innerText = inputTitle.value || "TÍTULO");
inputSubtitle.addEventListener('input', () => dispSubtitle.innerText = inputSubtitle.value || "Subtítulo");

// Cambiar Posiciones
document.getElementById('pos-title').addEventListener('change', (e) => {
    contTitle.className = `text-wrap ${e.target.value}`;
});
document.getElementById('pos-subtitle').addEventListener('change', (e) => {
    contSubtitle.className = `text-wrap ${e.target.value}`;
});

// Mostrar/Ocultar
document.getElementById('toggle-title').addEventListener('click', (e) => {
    showTitle = !showTitle;
    contTitle.style.display = showTitle ? "flex" : "none";
    e.target.innerText = showTitle ? "Ocultar" : "Mostrar";
});
document.getElementById('toggle-subtitle').addEventListener('click', (e) => {
    showSubtitle = !showSubtitle;
    contSubtitle.style.display = showSubtitle ? "flex" : "none";
    e.target.innerText = showSubtitle ? "Ocultar" : "Mostrar";
});

// --- GENERAR ---
document.getElementById('btn-generate').addEventListener('click', () => {
    if (!inputPrompt.value) return alert("Describe la imagen");
    loader.style.display = "block";
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(inputPrompt.value)}?seed=${seed}&width=800&height=1000&nologo=true`;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        imageReady = img;
        flyer.style.backgroundImage = `url('${url}')`;
        loader.style.display = "none";
    };
    img.src = url;
});

// --- DESCARGAR ---
document.getElementById('btn-download').addEventListener('click', () => {
    if (!imageReady) return alert("Genera una imagen primero");
    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageReady, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // Función para calcular Y según posición
    const getY = (pos) => {
        if (pos === "pos-top") return 150;
        if (pos === "pos-center") return 500;
        return 850;
    };

    if (showTitle) {
        ctx.font = "bold 70px Arial";
        const y = getY(document.getElementById('pos-title').value);
        ctx.fillText((inputTitle.value || "TÍTULO").toUpperCase(), 400, y);
    }

    if (showSubtitle) {
        ctx.font = "40px Arial";
        const y = getY(document.getElementById('pos-subtitle').value);
        ctx.fillText(inputSubtitle.value || "Subtítulo", 400, y);
    }

    const link = document.createElement('a');
    link.download = "flyer-ia.png";
    link.href = canvas.toDataURL();
    link.click();
});
