const flyer = document.getElementById('flyer-canvas-container');
const loader = document.getElementById('loader');
const inputT = document.getElementById('input-title');
const inputS = document.getElementById('input-subtitle');
const dispT = document.getElementById('display-title');
const dispS = document.getElementById('display-subtitle');

let loadedImg = null;

// Sincronizar texto
inputT.addEventListener('input', () => dispT.innerText = inputT.value || "Título");
inputS.addEventListener('input', () => dispS.innerText = inputS.value || "Subtítulo");

// Generar Imagen
document.getElementById('btn-generate').addEventListener('click', async () => {
    if (!inputT.value) return alert("Escribe una descripción");
    
    loader.style.display = "block";
    loader.innerText = "IA trabajando...";
    
    try {
        const res = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: inputT.value })
        });
        
        const data = await res.json();
        if (res.status === 503) return alert(data.error);
        
        if (data.image) {
            const img = new Image();
            img.onload = () => {
                loadedImg = img;
                flyer.style.backgroundImage = `url(${data.image})`;
                loader.style.display = "none";
            };
            img.src = data.image;
        }
    } catch (e) {
        alert("Error de conexión");
        loader.style.display = "none";
    }
});

// Descargar
document.getElementById('btn-download').addEventListener('click', () => {
    if (!loadedImg) return alert("Genera una imagen primero");
    
    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');
    
    // Dibujar todo
    ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 80px Arial";
    ctx.fillText(inputT.value.toUpperCase(), canvas.width/2, canvas.height/2);
    ctx.font = "40px Arial";
    ctx.fillText(inputS.value, canvas.width/2, canvas.height/2 + 80);
    
    const link = document.createElement('a');
    link.download = 'flyer.png';
    link.href = canvas.toDataURL();
    link.click();
});
