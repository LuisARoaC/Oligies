const flyerContainer = document.getElementById('flyer-canvas-container');
const loader = document.getElementById('loader');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');
const btnGenerate = document.getElementById('btn-generate');
const btnDownload = document.getElementById('btn-download');

let currentBackgroundImageURL = null; // Guardará la URL de la imagen de fondo generada

// Actualizar textos en pantalla
inputTitle.addEventListener('input', () => {
    displayTitle.innerText = inputTitle.value || "Tu Título";
});
inputSubtitle.addEventListener('input', () => {
    displaySubtitle.innerText = inputSubtitle.value || "Tu Subtítulo";
});

// Función para llamar a la IA (GENERAR IMAGEN Y MOSTRARLA DE FONDO)
btnGenerate.addEventListener('click', async () => {
    const prompt = inputTitle.value;
    if (!prompt) return alert("Escribe un título para generar la imagen");

    loader.style.display = "block";
    loader.innerText = "IA Generando...";
    flyerContainer.style.opacity = "0.7"; // Efecto de carga

    try {
        const response = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: prompt }),
        });

        const data = await response.json();

        // Manejo de errores de la API
        if (!response.ok) {
            if (response.status === 503) {
                alert("La IA se está encendiendo (modelo en frío). Espera 15 segundos y reintenta.");
            } else {
                alert(`Error en el servidor de IA: ${data.error || 'Desconocido'}`);
            }
            return; // Detener la ejecución si hay un error
        }

        if (data.image) {
            currentBackgroundImageURL = data.image; // Guarda la URL Base64
            // Aplica la imagen directamente como fondo al contenedor visible
            flyerContainer.style.backgroundImage = `url('${currentBackgroundImageURL}')`;
            flyerContainer.style.backgroundSize = "cover";
            flyerContainer.style.backgroundPosition = "center";
            loader.innerText = "¡Imagen generada!";
        } else {
            alert("La IA no devolvió una imagen.");
        }
    } catch (e) {
        console.error("Error al generar imagen:", e);
        alert("Ocurrió un problema de conexión al generar la imagen.");
    } finally {
        setTimeout(() => { 
            loader.style.display = "none"; 
            flyerContainer.style.opacity = "1"; // Quita el efecto de carga
        }, 1500);
    }
});

// Función para DESCARGAR FOTO COMPLETA (Fondo + Texto)
btnDownload.addEventListener('click', () => {
    if (!currentBackgroundImageURL) return alert("Primero genera una imagen con IA.");

    const canvas = document.getElementById('hidden-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Crucial para que el canvas pueda usar la imagen (evita CORS)
    img.crossOrigin = "anonymous"; 
    
    img.onload = function() {
        // Establecer las dimensiones del canvas a las del flyer
        canvas.width = flyerContainer.offsetWidth * 2; // Doble resolución para mejor calidad
        canvas.height = flyerContainer.offsetHeight * 2;
        
        // 1. Dibujar el fondo de la IA
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 2. Dibujar la capa oscura (overlay)
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // Más oscuro para que el texto resalte
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Configurar estilo del texto
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.8)"; // Sombra más pronunciada
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // 4. Escribir Título
        const titleText = inputTitle.value.toUpperCase();
        ctx.font = `bold ${canvas.width * 0.08}px Arial`; // Tamaño adaptable
        ctx.fillText(titleText, canvas.width / 2, canvas.height / 2 - (canvas.height * 0.05));

        // 5. Escribir Subtítulo
        const subtitleText = inputSubtitle.value;
        ctx.font = `${canvas.width * 0.04}px Arial`; // Tamaño adaptable
        ctx.fillText(subtitleText, canvas.width / 2, canvas.height / 2 + (canvas.height * 0.05));

        // 6. Descargar la imagen final
        const link = document.createElement('a');
        link.download = `flyer-ia-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    
    img.onerror = () => {
        alert("Error al cargar la imagen para la descarga. ¿Está bien la URL?");
    };

    // Asignar la URL generada a la imagen para dibujar en el canvas
    img.src = currentBackgroundImageURL;
});

