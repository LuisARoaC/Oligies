export default async function handler(req, res) {
    // 1. Configuración de cabeceras para permitir peticiones desde tu frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    const { prompt } = req.query;
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

    if (!prompt) {
        return res.status(400).json({ error: "Falta el prompt en la consulta." });
    }

    // Usaremos un modelo de alta calidad pero con mejor disponibilidad
    const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

    // Intentaremos hasta 3 veces si el servidor responde que está cargando (503)
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(MODEL_URL, {
                headers: { 
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: prompt,
                    options: { 
                        wait_for_model: true, // Indica a HF que si el modelo está dormido, lo despierte
                        use_cache: false      // Obliga a generar una imagen nueva cada vez
                    }
                }),
            });

            // Si el código es 503, es que el modelo se está cargando en los servidores de HF
            if (response.status === 503) {
                console.log(`Reintento ${i + 1}: El modelo está cargando...`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Esperamos 3 segundos
                continue; 
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HF Error: ${response.status} - ${errorText}`);
            }

            // Procesamos la imagen binaria a Base64
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');

            return res.status(200).json({ 
                url: `data:image/png;base64,${base64Image}` 
            });

        } catch (error) {
            // Si después de 3 intentos sigue fallando, enviamos el error final
            if (i === 2) {
                return res.status(500).json({ 
                    error: "La IA está muy saturada en este momento. Intenta de nuevo en unos segundos." 
                });
            }
        }
    }
}
