document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');

    // --- GENERACIÓN CON DICEBEAR ---
    btnGenerate.addEventListener('click', () => {
        // En DiceBear, el 'prompt' actúa como la semilla (seed)
        const seed = inputPrompt.value.trim() || Math.random().toString();

        loader.style.display = 'block';
        loader.innerText = "Diseñando fondo...";
        btnGenerate.disabled = true;

        // Estilo 'shapes' es ideal para fondos abstractos de flyers
        // Usamos formato .png para que sea compatible con el canvas de descarga
        const style = "shapes"; 
        const imageUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f172a,1e293b,3b82f6`;

        // Nota: DiceBear entrega SVGs por defecto. Para que funcione en el 
        // background-image de forma fluida, lo tratamos como una imagen normal.
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = function() {
            // Aplicamos la imagen al fondo
            flyerPreview.style.backgroundImage = `url('${imageUrl}')`;
            flyerPreview.style.backgroundSize = 'cover';
            
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        };

        img.onerror = function() {
            alert("Error al conectar con DiceBear");
            loader.style.display = 'none';
            btnGenerate.disabled = false;
        };

        img.src = imageUrl;
    });

    // --- ACTUALIZACIÓN DE TEXTOS ---
    const inputT = document.getElementById('input-title');
    const inputS = document.getElementById('input-subtitle');

    inputT.addEventListener('input', () => {
        displayTitle.innerText = inputT.value.toUpperCase() || "TÍTULO";
    });

    inputS.addEventListener('input', () => {
        displaySubtitle.innerText = inputS.value || "Subtítulo";
    });

    // --- LÓGICA DE ESTILOS (SELECTS) ---
    const selects = document.querySelectorAll('select');
    selects.forEach(sel => {
        sel.addEventListener('change', () => {
            const fontT = document.getElementById('font-title').value;
            const posT = document.getElementById('pos-title').value;
            const fontS = document.getElementById('font-subtitle').value;
            const posS = document.getElementById('pos-subtitle').value;

            displayTitle.style.fontFamily = fontT;
            document.getElementById('cont-title').className = `text-wrap ${posT}`;
            
            displaySubtitle.style.fontFamily = fontS;
            document.getElementById('cont-subtitle').className = `text-wrap ${posS}`;
        });
    });
});
