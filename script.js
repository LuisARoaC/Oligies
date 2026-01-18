async function generarConIA() {
    const prompt = inputTitle.value;
    if (!prompt) return alert("Escribe una descripción");

    loader.style.display = "block";
    loader.innerText = "La IA está despertando... (espera 20s)";
    
    try {
        const response = await fetch("/api/generar", {
            method: "POST",
            body: JSON.stringify({ prompt: prompt }),
        });

        // Si el servidor está cargando (Error 503), esperamos y reintentamos
        if (response.status === 503) {
            loader.innerText = "Casi listo, reintentando...";
            setTimeout(generarConIA, 10000); // Espera 10 segundos y vuelve a intentar
            return;
        }

        if (!response.ok) throw new Error();

        const data = await response.json();
        if (data.image) {
            flyer.style.backgroundImage = `url('${data.image}')`;
            loader.innerText = "¡Imagen creada!";
        }
    } catch (e) {
        console.error(e);
        alert("Hubo un problema. Reintenta en un momento.");
    } finally {
        // Solo quitamos el loader si hubo éxito o error definitivo
        if (loader.innerText !== "Casi listo, reintentando...") {
            setTimeout(() => { loader.style.display = "none"; }, 2000);
        }
    }
}

