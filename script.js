/* --- REPERTORIO MAESTRO DE GOOGLE FONTS --- */
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@700&family=Caudex:wght@700&family=Lato:wght@400;700&family=Lobster&family=Monoton&family=Oswald:wght@700&family=Pacifico&family=Playfair+Display:wght@700&family=Poppins:wght@400;700&family=Raleway:wght@700&family=Fira+Code&family=Bangers&family=Creepster&family=Press+Start+2P&family=Dancing+Script:wght@700&family=Cinzel:wght@700&display=swap');

body { 
    font-family: 'Poppins', sans-serif; 
    background: #0f172a; 
    color: white; 
    display: flex; 
    justify-content: center; 
    padding: 20px; 
    margin: 0;
}

.container { max-width: 1200px; width: 100%; }

.main-layout { 
    display: flex; 
    gap: 30px; 
    flex-wrap: wrap; 
    justify-content: center;
}

/* --- VISTA PREVIA DEL FLYER --- */
.flyer { 
    width: 350px; 
    height: 450px; 
    background: #1e293b; 
    border-radius: 15px; 
    position: relative; 
    overflow: hidden; 
    background-size: cover; 
    background-position: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 1;
}

/* --- MANEJO DE TEXTO DINÁMICO --- */
.text-wrap { 
    position: absolute; 
    width: 100%; 
    display: flex; 
    justify-content: center; 
    padding: 20px; 
    box-sizing: border-box; 
    transition: all 0.3s ease;
    z-index: 2;
}

.pos-top { top: 10px; }
.pos-center { top: 40%; }
.pos-bottom { bottom: 10px; }

.text-wrap h2, .text-wrap p { 
    margin: 0; 
    text-shadow: 2px 2px 10px rgba(0,0,0,0.8); 
    text-align: center; 
    word-break: break-word;
}

#display-title { font-size: 2.2rem; line-height: 1.1; }
#display-subtitle { font-size: 1.2rem; }

/* --- SIDEBAR Y CONTROLES --- */
.sidebar { width: 350px; display: flex; flex-direction: column; gap: 15px; }

.group { 
    background: #1e293b; 
    padding: 15px; 
    border-radius: 10px; 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
    border: 1px solid #334155;
}

.actions { display: flex; gap: 8px; flex-wrap: wrap; }

label { font-size: 0.9rem; color: #94a3b8; font-weight: bold; }

select, input { 
    padding: 10px; 
    border-radius: 6px; 
    border: 1px solid #475569; 
    background: #0f172a; 
    color: white; 
    font-size: 0.9rem;
    outline: none;
}

select:focus, input:focus { border-color: #3b82f6; }

button { 
    padding: 12px; 
    border: none; 
    border-radius: 6px; 
    cursor: pointer; 
    font-weight: bold; 
    transition: 0.2s;
}

#btn-generate { background: #3b82f6; color: white; }
#btn-generate:hover { background: #2563eb; }

.btn-sm { padding: 6px 12px; font-size: 0.8rem; background: #475569; color: white; }

.secondary { 
    background: #10b981; 
    color: white; 
    font-size: 1.1rem; 
    margin-top: 10px; 
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}
.secondary:hover { background: #059669; }

.loader { 
    position: absolute; 
    top: 50%; left: 50%; 
    transform: translate(-50%, -50%);
    z-index: 20; 
    background: rgba(0,0,0,0.85); 
    padding: 15px 25px; 
    border-radius: 30px;
    display: none; 
    font-weight: bold;
    border: 1px solid #3b82f6;
}
