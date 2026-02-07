document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const btnGenerate = document.getElementById('btn-generate');
    const flyerPreview = document.getElementById('flyer-preview');
    const loader = document.getElementById('loader');
    const inputPrompt = document.getElementById('input-prompt');
    const displayTitle = document.getElementById('display-title');
    const displaySubtitle = document.getElementById('display-subtitle');

    // --- GENERACIÓN CON DICEBEAR ---
    btnGenerate.addEventListener('click', () => {
        const seed = inputPrompt.value.trim() || Math.floor(Math.random() * 100000);
        
        loader.style.display = 'block';
        btnGenerate.disabled = true;

        // Usamos la API de DiceBear con el estilo 'shapes' (figuras geométricas)
        // Agregamos parámetros para que el fondo sea colorido y moderno
        const style = 'shapes';
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

        // Creamos un objeto imagen para cargar el SVG antes de mostrarlo
        const img = new Image();
        
        // El truco para que el navegador no bloquee el diseño:
        img.crossOrigin = "anonymous"; 
        
        img.onload = function() {
            // Aplicamos al contenedor del flyer
            flyerPreview.style.backgroundImage = `url('${url}')`;
            flyerPreview.style.backgroundSize = "cover";
            
            loader.style.display = 'none';
            btnGenerate.disabled = false;
            console.log("Fondo cargado correctamente");
        };

        img.onerror = function() {
            console.error("Error cargando DiceBear");
            loader.innerText = "Error de conexión";
            btnGenerate.disabled = false;
        };

        img.src = url;
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

        // Título
        displayTitle.style.fontFamily = fontTitle;
        document.getElementById('cont-title').className = `text-wrap ${posTitle}`;

        // Subtítulo
        displaySubtitle.style.fontFamily = fontSub;
        document.getElementById('cont-subtitle').className = `text-wrap ${posSub}`;
    };

    // Escuchar cambios en todos los selects
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', updateStyles);
    });

    // --- DESCARGAR FLYER ---
    document.getElementById('btn-download').addEventListener('click', () => {
        alert("Para descargar en alta calidad con fondos SVG, te recomiendo usar la función 'Imprimir a PDF' o captura de pantalla, ya que los navegadores restringen la descarga de SVGs mediante Canvas por seguridad.");
    });
});
