document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');
    
    // Guardamos la URL de la imagen actual para la descarga
    let currentImageBase64 = "";

    // --- GENERACIÓN CON IA (BACKEND VERCEL) ---
    btnGenerate.addEventListener('click', async () => {
        const prompt = inputPrompt.value.trim();
        if (!prompt) return alert("Escribe qué quieres generar (ej: 'cyberpunk city' o 'sunset beach')");

        loader.style.display = 'block';
        loader.innerText = "La IA gratuita está trabajando...";
        btnGenerate.disabled = true;

        try {
            // Llamamos a tu API en Vercel
            const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`);
            const data = await response.json();

            if (data.url) {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Evita problemas de seguridad
                img.src = data.url;

                img.onload = () => {
                    flyerPreview.style.backgroundImage = `url('${data.url}')`;
                    flyerPreview.style.backgroundSize = "cover";
                    flyerPreview.style.backgroundPosition = "center";
                    
                    currentImageBase64 = data.url; // Guardamos para la descarga
                    loader.style.display = 'none';
                    btnGenerate.disabled = false;
                };
            } else {
                throw new Error(data.error || "No se recibió la imagen");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Aviso: " + error.message);
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        }
    });

    // --- ACTUALIZACIÓN DE TEXTO EN TIEMPO REAL ---
    document.getElementById('input-title').addEventListener('input', (e) => {
        displayTitle.innerText = e.target.value.toUpperCase() || "TÍTULO";
    });

    document.getElementById('input-subtitle').addEventListener('input', (e) => {
        displaySubtitle.innerText = e.target.value || "Subtítulo";
    });

    // --- MANEJO DE TIPOGRAFÍAS Y POSICIONES ---
    const updateStyles = () => {
        const fontTitle = document.getElementById('font-title').value;
        const posTitle = document.getElementById('pos-title').value;
        const fontSub = document.getElementById('font-subtitle').value;
        const posSub = document.getElementById('pos-subtitle').value;

        displayTitle.style.fontFamily = fontTitle;
        document.getElementById('cont-title').className = `text-wrap ${posTitle}`;

        displaySubtitle.style.fontFamily = fontSub;
        document.getElementById('cont-subtitle').className = `text-wrap ${posSub}`;
    };

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', updateStyles);
    });

    // --- DESCARGAR FLYER (AHORA FUNCIONAL) ---
    document.getElementById('btn-download').addEventListener('click', () => {
        if (!currentImageBase64) return alert("Primero genera una imagen de fondo.");

        // Creamos un canvas oculto de 800x1000 (tamaño flyer)
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');

        const bgImg = new Image();
        bgImg.src = currentImageBase64;
        
        bgImg.onload = () => {
            // 1. Dibujar el fondo
            ctx.drawImage(bgImg, 0, 0, 800, 1000);

            // 2. Capa de oscurecimiento (opcional, para que el texto resalte)
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, 800, 1000);

            // 3. Dibujar Título
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = `bold 70px ${document.getElementById('font-title').value}`;
            // Ajustamos la posición según el selector
            let yPos = 500; 
            if(document.getElementById('pos-title').value.includes('top')) yPos = 200;
            if(document.getElementById('pos-title').value.includes('bottom')) yPos = 800;
            ctx.fillText(displayTitle.innerText, 400, yPos);

            // 4. Descargar
            const link = document.createElement('a');
            link.download = 'mi-flyer-ia.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    });
});
