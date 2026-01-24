const flyer = document.getElementById('flyer-preview');
const loader = document.getElementById('loader');
const inputPrompt = document.getElementById('input-prompt');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');

const dispTitle = document.getElementById('display-title');
const dispSubtitle = document.getElementById('display-subtitle');
const contTitle = document.getElementById('cont-title');
const contSubtitle = document.getElementById('cont-subtitle');

let imageReady = null;
let showTitle = true;
let showSubtitle = true;

// Sincronización de Texto y Fuentes
inputTitle.addEventListener('input', () => dispTitle.innerText = inputTitle.value || "TÍTULO");
inputSubtitle.addEventListener('input', () => dispSubtitle.innerText = inputSubtitle.value || "Subtítulo");

document.getElementById('font-title').addEventListener('change', (e) => {
    dispTitle.style.fontFamily = e.target.value;
});
document.getElementById('font-subtitle').addEventListener('change', (e) => {
    dispSubtitle.style.fontFamily = e.target.value;
});

// Posiciones y Visibilidad
document.getElementById('pos-title').addEventListener('change', (e) => contTitle.className = `text-wrap ${e.target.value}`);
document.getElementById('pos-subtitle').addEventListener('change', (e) => contSubtitle.className = `text-wrap ${e.target.value}`);

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

// Generar Imagen
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

// Descargar con soporte para fuentes
document.getElementById('btn-download').addEventListener('click', async () => {
    if (!imageReady) return alert("Genera una imagen primero");
    
    // Asegurar que las fuentes externas estén cargadas antes de dibujar
    await document.fonts.ready;

    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageReady, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const getY = (pos) => {
        if (pos === "pos-top") return 150;
        if (pos === "pos-center") return 500;
        return 850;
    };

    if (showTitle) {
        const font = document.getElementById('font-title').value;
        ctx.font = `bold 70px "${font}"`;
        const y = getY(document.getElementById('pos-title').value);
        ctx.fillText((inputTitle.value || "TÍTULO").toUpperCase(), 400, y);
    }

    if (showSubtitle) {
        const fontSub = document.getElementById('font-subtitle').value;
        ctx.font = `40px "${fontSub}"`;
        const y = getY(document.getElementById('pos-subtitle').value);
        ctx.fillText(inputSubtitle.value || "Subtítulo", 400, y);
    }

    const link = document.createElement('a');
    link.download = "flyer-ia.png";
    link.href = canvas.toDataURL();
    link.click();
});
