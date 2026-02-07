document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');

    // --- GENERACIÓN DE IMAGEN (Estilo Directo) ---
    btnGenerate.addEventListener('click', () => {
        const prompt = inputPrompt.value.trim();
        if (!prompt) return alert("Por favor, describe una imagen.");

        // 1. Mostrar loader
        loader.style.display = 'block';
        loader.innerText = "Creando arte...";
        btnGenerate.disabled = true;

        // 2. Parámetros mágicos para que no falle:
        // seed: genera algo nuevo siempre
        // model: usamos 'flux' que es el más estable y de mejor calidad
        const seed = Math.floor(Math.random() * 99999);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1000&seed=${seed}&model=flux&nologo=true`;

        // 3. Crear el objeto imagen en memoria para verificar carga
        const img = new Image();
        img.crossOrigin = "anonymous"; // Crucial para que el botón Descargar funcione
        
        img.onload = function() {
            flyerPreview.style.backgroundImage = `url('${imageUrl}')`;
            flyerPreview.style.backgroundSize = 'cover';
            flyerPreview.style.backgroundPosition = 'center';
            
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        };

        img.onerror = function() {
            alert("El servidor está ocupado. Intenta de nuevo en un segundo.");
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        };

        // Iniciar carga
        img.src = imageUrl;
    });

    // --- CONTROL DE TEXTOS ---
    document.getElementById('input-title').addEventListener('input', (e) => {
        document.getElementById('display-title').innerText = e.target.value.toUpperCase() || "TÍTULO";
    });

    document.getElementById('input-subtitle').addEventListener('input', (e) => {
        document.getElementById('display-subtitle').innerText = e.target.value || "Subtítulo";
    });
});
