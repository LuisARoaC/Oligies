document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');
    
    const btnHide = document.getElementById('btn-hide');
    const panelSettings = document.getElementById('panel-settings');
    
    let currentImageUrl = "";

    // --- LÓGICA FUSIONADA: OCULTAR PANEL Y TEXTOS ---
    if (btnHide) {
        btnHide.addEventListener('click', () => {
            const contTitle = document.getElementById('cont-title');
            const contSub = document.getElementById('cont-subtitle');
            
            // Verificamos si el panel de ajustes está visible
            // Usamos getComputedStyle para mayor precisión
            const panelVisible = panelSettings && window.getComputedStyle(panelSettings).display !== 'none';

            if (panelVisible) {
                // 1. Ocultar Panel de ajustes
                if(panelSettings) panelSettings.style.display = 'none';
                
                // 2. Ocultar Textos sobre el flyer
                if(contTitle) contTitle.style.visibility = 'hidden';
                if(contSub) contSub.style.visibility = 'hidden';
                
                btnHide.innerText = 'Mostrar Todo';
            } else {
                // 1. Mostrar Panel de ajustes
                if(panelSettings) panelSettings.style.display = 'block';
                
                // 2. Mostrar Textos sobre el flyer
                if(contTitle) contTitle.style.visibility = 'visible';
                if(contSub) contSub.style.visibility = 'visible';
                
                btnHide.innerText = 'Ocultar Todo';
            }
        });
    }

    // --- GENERACIÓN CON IA (ÓRDENES ESTRICTAS DE FLYER) ---
    btnGenerate.addEventListener('click', async () => {
        const userPrompt = inputPrompt.value.trim();
        if (!userPrompt) return alert("Escribe qué quieres generar para el flyer");

        loader.style.display = 'block';
        loader.innerText = "Diseñando tu flyer exclusivo...";
        btnGenerate.disabled = true;

        try {
            const seed = Math.floor(Math.random() * 999999);
            const model = 'flux'; 
            
            // Instrucción de personalidad única para la IA
            const systemRules = "Professional graphic design flyer, high quality commercial poster template, marketing aesthetic, no real human faces, vector style backgrounds, ";
            const appConstraint = "THIS APP IS EXCLUSIVELY FOR FLYER GENERATION. SUBJECT: ";
            
            const finalPrompt = `${systemRules} ${appConstraint} ${userPrompt}`;

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
                loader.style.display = 'none';
                btnGenerate.disabled = false;
                alert("Error al conectar con la IA.");
            };

        } catch (error) {
            console.error("Error:", error);
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
        const contTitle = document.getElementById('cont-title');
        const contSub = document.getElementById('cont-subtitle');
        
        if(contTitle) contTitle.className = `text-wrap ${posTitle}`;
        if(contSub) contSub.className = `text-wrap ${posSub}`;
    };

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', updateStyles);
    });

    // --- DESCARGA DEL FLYER ---
    document.getElementById('btn-download').addEventListener('click', async () => {
        if (!currentImageUrl) return alert("Primero genera una imagen de fondo.");

        await document.fonts.ready;

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

            // Título en Canvas
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            const fontTitle = document.getElementById('font-title').value;
            ctx.font = `bold 80px ${fontTitle}`;
            
            let yPosTitle = 500; 
            const posTitleValue = document.getElementById('pos-title').value;
            if(posTitleValue.includes('top')) yPosTitle = 200;
            if(posTitleValue.includes('bottom')) yPosTitle = 800;
            
            ctx.fillText(displayTitle.innerText, 400, yPosTitle);

            // Subtítulo en Canvas
            const fontSub = document.getElementById('font-subtitle').value;
            ctx.font = `40px ${fontSub}`;
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
