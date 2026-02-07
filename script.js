document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const btnGenerate = document.getElementById('btn-generate');
    const btnDownload = document.getElementById('btn-download');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    
    // Inputs de Texto
    const inputPrompt = document.getElementById('input-prompt');
    const inputTitle = document.getElementById('input-title');
    const inputSubtitle = document.getElementById('input-subtitle');
    
    // Displays de Texto
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');
    
    // Controles de Estilo
    const fontTitle = document.getElementById('font-title');
    const posTitle = document.getElementById('pos-title');
    const toggleTitle = document.getElementById('toggle-title');
    
    const fontSubtitle = document.getElementById('font-subtitle');
    const posSubtitle = document.getElementById('pos-subtitle');
    const toggleSubtitle = document.getElementById('toggle-subtitle');

    // --- LÓGICA DE ACTUALIZACIÓN EN TIEMPO REAL ---

    // Actualizar Texto
    inputTitle.addEventListener('input', (e) => {
        displayTitle.innerText = e.target.value.toUpperCase() || "TÍTULO";
    });

    inputSubtitle.addEventListener('input', (e) => {
        displaySubtitle.innerText = e.target.value || "Subtítulo";
    });

    // Actualizar Tipografías y Posiciones
    const updateStyles = () => {
        // Título
        displayTitle.style.fontFamily = fontTitle.value;
        document.getElementById('cont-title').className = `text-wrap ${posTitle.value}`;
        
        // Subtítulo
        displaySubtitle.style.fontFamily = fontSubtitle.value;
        document.getElementById('cont-subtitle').className = `text-wrap ${posSubtitle.value}`;
    };

    [fontTitle, posTitle, fontSubtitle, posSubtitle].forEach(el => {
        el.addEventListener('change', updateStyles);
    });

    // Botones de Ocultar/Mostrar
    toggleTitle.addEventListener('click', () => {
        displayTitle.style.display = displayTitle.style.display === 'none' ? 'block' : 'none';
        toggleTitle.innerText = displayTitle.style.display === 'none' ? 'Mostrar' : 'Ocultar';
    });

    toggleSubtitle.addEventListener('click', () => {
        displaySubtitle.style.display = displaySubtitle.style.display === 'none' ? 'block' : 'none';
        toggleSubtitle.innerText = displaySubtitle.style.display === 'none' ? 'Mostrar' : 'Ocultar';
    });

    // --- GENERACIÓN DE IMAGEN (IA) ---

    btnGenerate.addEventListener('click', async () => {
        const prompt = inputPrompt.value.trim();
        if (!prompt) return alert("Por favor, escribe una descripción para la imagen.");

        loader.style.display = 'block';
        btnGenerate.disabled = true;

        // Usamos Pollinations AI (Gratis y sin necesidad de API Key compleja para GET)
        const width = 800;
        const height = 1000;
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

        try {
            // Pre-cargamos la imagen para que no parpadee
            const img = new Image();
            img.crossOrigin = "anonymous"; // Importante para poder descargar después
            img.src = imageUrl;
            
            img.onload = () => {
                flyerPreview.style.backgroundImage = `url('${imageUrl}')`;
                loader.style.display = 'none';
                btnGenerate.disabled = false;
            };
        } catch (error) {
            console.error("Error generando imagen:", error);
            alert("Hubo un error al generar la imagen.");
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        }
    });

    // --- FUNCIÓN DE DESCARGA (CANVAS) ---

    btnDownload.addEventListener('click', () => {
        const canvas = document.getElementById('hidden-canvas');
        const ctx = canvas.getContext('2d');
        
        // 1. Dibujar el fondo (Imagen de la IA)
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        
        // Extraer la URL del background-image
        const style = window.getComputedStyle(flyerPreview).backgroundImage;
        const url = style.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

        if (!url || url === 'none') {
            return alert("Primero genera una imagen de fondo.");
        }

        bgImg.src = url;
        bgImg.onload = () => {
            // Dibujar imagen
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            
            // Capa de oscurecimiento (overlay)
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Configurar y dibujar Título
            if (displayTitle.style.display !== 'none') {
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = `bold 70px ${fontTitle.value}`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "black";
                
                let yPos = canvas.height / 2;
                if (posTitle.value === 'pos-top') yPos = 150;
                if (posTitle.value === 'pos-bottom') yPos = canvas.height - 150;
                
                ctx.fillText(displayTitle.innerText, canvas.width / 2, yPos);
            }

            // 3. Configurar y dibujar Subtítulo
            if (displaySubtitle.style.display !== 'none') {
                ctx.font = `40px ${fontSubtitle.value}`;
                let ySubPos = canvas.height - 80;
                if (posSubtitle.value === 'pos-top') ySubPos = 220;
                if (posSubtitle.value === 'pos-center') ySubPos = (canvas.height / 2) + 80;
                
                ctx.fillText(displaySubtitle.innerText, canvas.width / 2, ySubPos);
            }

            // 4. Descargar
            const link = document.createElement('a');
            link.download = 'mi-flyer-ia.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    });
});
