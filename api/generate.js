export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    const { prompt } = req.query;
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

    if (!prompt) {
        return res.status(400).json({ error: "Falta el prompt." });
    }

    // CAMBIO CLAVE: Usamos la versión 1.5 que es mucho más estable y rápida
    const MODEL_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

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
                        wait_for_model: true,
                        use_cache: false 
                    }
                }),
            });

            if (response.status === 503 || response.status === 429) {
                // Si está cargando o hay demasiadas peticiones, esperamos y reintentamos
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue; 
            }

            if (!response.ok) throw new Error("Error en servidor");

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');

            return res.status(200).json({ 
                url: `data:image/png;base64,${base64Image}` 
            });

        } catch (error) {
            if (i === 2) {
                return res.status(500).json({ 
                    error: "Servidores saturados. Intenta con un prompt más corto o espera 5 segundos." 
                });
            }
        }
    }
}
