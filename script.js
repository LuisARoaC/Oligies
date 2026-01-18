// Seleccionamos los elementos del DOM
const flyer = document.getElementById('flyer-canvas');
const loader = document.getElementById('loader');
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');
const btnGenerate = document.getElementById('btn-generate');

// 1. Actualización de textos en tiempo real
inputTitle.addEventListener('input', () => {
    displayTitle.innerText = inputTitle.value || "Tu Título";
});

inputSubtitle.addEventListener('input', () => {
    displaySubtitle.innerText = inputSubtitle.value || "Tu Subtítulo";
});

// 2. Función principal de la IA
async function generarConIA() {
    const prompt = inputTitle.value;
    if (!prompt) return alert("Escribe una descripción en el título");

    loader.style.display = "block";
    loader.innerText = "La IA está despertando... (espera 20s)";
    flyer.style.opacity = "0.7";
    
    try {
        const response = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: prompt }),
        });

        if (response.status === 503) {
            loader.innerText = "Casi listo, reintentando...";
            setTimeout(generarConIA, 10000); 
            return;
        }

        if (!response.ok) throw new Error("Error en la respuesta");

        const data = await response.json();
        if (data.image) {
            flyer.style.backgroundImage = `url('${data.image}')`;
            loader.innerText = "¡Imagen creada!";
        }
    } catch (e) {
        console.error(e);
        alert("La IA sigue cargando o hubo un error. Reintenta en un momento.");
    } finally {
        if (loader.innerText !== "Casi listo, reintentando...") {
            setTimeout(() => { 
                loader.style.display = "none"; 
                flyer.style.opacity = "1";
            }, 2000);
        }
    }
}

// 3. ESCUCHAR EL CLIC DEL BOTÓN (Esto faltaba)
btnGenerate.addEventListener('click', generarConIA);

