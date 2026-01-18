const flyer = document.getElementById('flyer-preview');
const loader = document.getElementById('loader');
const inputT = document.getElementById('input-title');
const inputS = document.getElementById('input-subtitle');
const dispT = document.getElementById('display-title');
const dispS = document.getElementById('display-subtitle');

let imgIA = null;

// Actualizar textos en tiempo real
inputT.addEventListener('input', () => dispT.innerText = inputT.value || "Título");
inputS.addEventListener('input', () => dispS.innerText = inputS.value || "Subtítulo");

// 1. Generar Imagen
document.getElementById('btn-generate').addEventListener('click', async () => {
    if (!inputT.value) return alert("Escribe un título");
    
    loader.style.display = "block";
    loader.innerText = "Generando...";
    
    try {
        const res = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: inputT.value })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imgIA = img;
            flyer.style.backgroundImage = `url(${data.image})`;
            loader.style.display = "none";
        };
        img.src = data.image;
    } catch (e) {
        alert("Error: " + e.message);
        loader.style.display = "none";
    }
});

// 2. Descargar Flyer Completo
document.getElementById('btn-download').addEventListener('click', () => {
    if (!imgIA) return alert("Genera una imagen primero");
    
    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(imgIA, 0, 0, canvas.width, canvas.height);
    
    // Filtro oscuro
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texto
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Arial";
    ctx.fillText(inputT.value.toUpperCase(), canvas.width/2, canvas.height/2);
    ctx.font = "30px Arial";
    ctx.fillText(inputS.value, canvas.width/2, canvas.height/2 + 60);
    
    const link = document.createElement('a');
    link.download = 'mi-flyer.png';
    link.href = canvas.toDataURL();
    link.click();
});
