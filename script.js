const flyerContainer = document.getElementById('flyer-canvas-container');
const loader = document.getElementById('loader');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');

let currentImageBase64 = null; // Guardaremos la imagen aquí

// Actualizar textos en pantalla
inputTitle.addEventListener('input', () => displayTitle.innerText = inputTitle.value || "Tu Título");
inputSubtitle.addEventListener('input', () => displaySubtitle.innerText = inputSubtitle.value || "Tu Subtítulo");

// 1. GENERAR IMAGEN
document.getElementById('btn-generate').addEventListener('click', async () => {
    if (!inputTitle.value) return alert("Escribe una descripción");
    
    loader.style.display = "block";
    loader.innerText = "IA Generando...";

    try {
        const response = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: inputTitle.value }),
        });

        const data = await response.json();

        if (response.status === 503) {
            alert("La IA se está encendiendo. Espera 15 segundos y pulsa el botón otra vez.");
            return;
        }

        if (data.image) {
            currentImageBase64 = data.image; // Guardamos el resultado
            // Aplicamos al fondo
            flyerContainer.style.backgroundImage = `url('${data.image}')`;
            flyerContainer.style.backgroundSize = "cover";
            loader.innerText = "¡Imagen lista!";
        } else {
            throw new Error();
        }
    } catch (e) {
        alert("Error al generar. Reintenta en un momento.");
    } finally {
        setTimeout(() => { loader.style.display = "none"; }, 2000);
    }
});

// 2. DESCARGAR FOTO COMPLETA (Fondo + Texto)
document.getElementById('btn-download').addEventListener('click', () => {
    if (!currentImageBase64) return alert("Primero genera una imagen");

    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // IMPORTANTE: Esto permite que el canvas procese la imagen de Vercel
    img.crossOrigin = "Anonymous"; 
    
    img.onload = function() {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar Fondo
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Dibujar Sombra/Filtro oscuro para que el texto se lea
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Configurar Texto
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Dibujar Título
        ctx.font = "bold 70px Arial";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.fillText(inputTitle.value.toUpperCase(), canvas.width / 2, canvas.height / 2 - 20);

        // Dibujar Subtítulo
        ctx.font = "40px Arial";
        ctx.shadowBlur = 8;
        ctx.fillText(inputSubtitle.value, canvas.width / 2, canvas.height / 2 + 60);

        // Crear link de descarga
        const link = document.createElement('a');
        link.download = `flyer-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    
    img.src = currentImageBase64;
});

// 3. ESCUCHAR EL CLIC DEL BOTÓN (Esto faltaba)
btnGenerate.addEventListener('click', generarConIA);


