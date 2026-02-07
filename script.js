document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS DE ELEMENTOS ---
    const btnGenerate = document.getElementById('btn-generate');
    const inputPrompt = document.getElementById('input-prompt');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');

    // Título
    const inputTitle = document.getElementById('input-title');
    const displayTitle = document.getElementById('display-title');
    const fontTitle = document.getElementById('font-title');
    const posTitle = document.getElementById('pos-title');
    const contTitle = document.getElementById('cont-title');
    const btnToggleTitle = document.getElementById('toggle-title');

    // Subtítulo
    const inputSubtitle = document.getElementById('input-subtitle');
    const displaySubtitle = document.getElementById('display-subtitle');
    const fontSubtitle = document.getElementById('font-subtitle');
    const posSubtitle = document.getElementById('pos-subtitle');
    const contSubtitle = document.getElementById('cont-subtitle');
    const btnToggleSubtitle = document.getElementById('toggle-subtitle');

    // --- LÓGICA DE ACTUALIZACIÓN DE TEXTO ---

    // Cambiar contenido de texto
    inputTitle.addEventListener('input', () => {
        displayTitle.innerText = inputTitle.value || "TÍTULO";
    });

    inputSubtitle.addEventListener('input', () => {
        displaySubtitle.innerText = inputSubtitle.value || "Subtítulo";
    });

    // Cambiar tipografías
    fontTitle.addEventListener('change', () => {
        displayTitle.style.fontFamily = fontTitle.value;
    });

    fontSubtitle.addEventListener('change', () => {
        displaySubtitle.style.fontFamily = fontSubtitle.value;
    });

    // Cambiar posiciones (Manejo de clases CSS)
    posTitle.addEventListener('change', () => {
        contTitle.className = `text-wrap ${posTitle.value}`;
    });

    posSubtitle.addEventListener('change', () => {
        contSubtitle.className = `text-wrap ${posSubtitle.value}`;
    });

    // Botones Ocultar/Mostrar
    btnToggleTitle.onclick = () => toggleVisibility(contTitle, btnToggleTitle);
    btnToggleSubtitle.onclick = () => toggleVisibility(contSubtitle, btnToggleSubtitle);

    function toggleVisibility(element, button) {
        if (element.style.display === 'none') {
            element.style.display = 'flex';
            button.innerText = "Ocultar";
        } else {
            element.style.display = 'none';
            button.innerText = "Mostrar";
        }
    }

    // --- LÓGICA DE GENERACIÓN DE IMAGEN (IA) ---

    btnGenerate.addEventListener('click', async () => {
        const prompt = inputPrompt.value.trim();
        if (!prompt) return alert("Por favor, escribe un prompt para la imagen.");

        // Mostrar cargador
        loader.style.display = 'block';

        // Usamos Pollinations.ai (una API gratuita y rápida que no requiere registro)
        // Ideal para prototipos de flyers con IA
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1000&seed=${seed}&nologo=true`;

        // Precargar la imagen para que no parpadee
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            flyerPreview.style.backgroundImage = `url('${imageUrl}')`;
            loader.style.display = 'none';
        };
        
        img.onerror = () => {
            loader.style.display = 'none';
            alert("Error al generar la imagen. Intenta con un prompt diferente.");
        };
    });
});
