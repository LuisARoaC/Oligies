document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');
    
    // --- NUEVO: Referencias para Ocultar Panel ---
    // Asegúrate de que en tu HTML el panel de ajustes tenga id="panel-settings" 
    // y el botón id="btn-hide"
    const btnHide = document.getElementById('btn-hide');
    const panelSettings = document.getElementById('panel-settings');
    
    let currentImageUrl = "";

    // --- LÓGICA PARA OCULTAR/MOSTRAR PANEL ---
    if (btnHide && panelSettings) {
        btnHide.addEventListener('click', () => {
            const isHidden = panelSettings.style.display === 'none';
            panelSettings.style.display = isHidden ? 'block' : 'none';
            btnHide.innerText = isHidden ? 'Ocultar Ajustes' : 'Mostrar Ajustes';
        });
    }

    // --- GENERACIÓN CON IA ---
    btnGenerate.addEventListener('click', async () => {
        const userPrompt = inputPrompt.value.trim();
        if (!userPrompt) return alert("Escribe qué quieres generar para el flyer");

        loader.style.display = 'block';
        loader.innerText = "Diseñando tu flyer exclusivo...";
        btnGenerate.disabled = true;

        try {
            const seed = Math.floor(Math.random() * 999999);
            const model = 'flux'; 
            
            // --- MODIFICACIÓN: Instrucciones estrictas para la IA ---
            // Definimos el ADN de la aplicación: exclusivamente flyers.
            const systemRules = "Professional graphic design flyer, promotional poster style, high quality commercial template, no realistic faces unless requested, graphic design aesthetic, ";
            const appConstraint = "EXCLUSIVE FLYER GENERATION APP PURPOSE: ";
            
            const finalPrompt = `${systemRules} ${appConstraint} ${userPrompt}`;

            // Construimos la URL con el prompt vitaminado
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=1000&model=${model}&seed=${seed}&nologo=true`;

            const img = new Image();
            img.crossOrigin = "anonymous"; 
            img.src = imageUrl;

            img.onload = () => {
                flyerPreview.style.backgroundImage = `url('${imageUrl}')`;
                flyerPreview.style.backgroundSize = "cover";
                flyerPreview.style.backgroundPosition = "center";
                
                currentImageUrl = imageUrl;
                loader.style.display = 'none';
                btnGenerate.disabled = false;
            };

            img.onerror = () => {
                throw new Error("Error al cargar la imagen desde el servidor de IA.");
            };

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

    // --- DESCARGAR FLYER ---
    document.getElementById('btn-download').addEventListener('click', () => {
        if (!currentImageUrl) return alert("Primero genera una imagen de fondo.");

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');

        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous"; 
        bgImg.src = currentImageUrl;
        
        bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, 800, 1000);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(0, 0, 800, 1000);

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = `bold 80px ${document.getElementById('font-title').value}`;
            
            let yPosTitle = 500; 
            const posTitleValue = document.getElementById('pos-title').value;
            if(posTitleValue.includes('top')) yPosTitle = 200;
            if(posTitleValue.includes('bottom')) yPosTitle = 800;
            
            ctx.fillText(displayTitle.innerText, 400, yPosTitle);

            ctx.font = `40px ${document.getElementById('font-subtitle').value}`;
            let yPosSub = yPosTitle + 70;
            const posSubValue = document.getElementById('pos-subtitle').value;
            if(posSubValue.includes('top')) yPosSub = 280;
            if(posSubValue.includes('bottom')) yPosSub = 880;

            ctx.fillText(displaySubtitle.innerText, 400, yPosSub);

            const link = document.createElement('a');
            link.download = `flyer-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    });
});
