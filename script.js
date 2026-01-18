const flyer = document.getElementById('flyer-canvas');
const loader = document.getElementById('loader');
const inputTitle = document.getElementById('input-title');
const displayTitle = document.getElementById('display-title');

document.getElementById('btn-generate').addEventListener('click', async () => {
    const prompt = inputTitle.value;
    if (!prompt) return alert("Escribe algo primero");

    loader.style.display = "block";
    
    try {
        // Llamamos a nuestra función secreta en Vercel
        const response = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: prompt }),
        });

        const data = await response.json();
        if (data.image) {
            flyer.style.backgroundImage = `url('${data.image}')`;
        } else {
            throw new Error();
        }
    } catch (e) {
        alert("La IA está despertando. Reintenta en 10 segundos.");
    } finally {
        loader.style.display = "none";
    }
});

// Actualizar texto
inputTitle.addEventListener('input', (e) => {
    displayTitle.innerText = e.target.value;
});
