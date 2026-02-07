// api/generate.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { prompt } = req.query;
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

    if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

    // Intentaremos hasta 3 veces si está ocupado
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    headers: { Authorization: `Bearer ${HF_TOKEN}` },
                    method: "POST",
                    body: JSON.stringify({ 
                        inputs: prompt,
                        options: { wait_for_model: true } // <--- Esto le dice a HF que espere a que el modelo cargue
                    }),
                }
            );

            if (response.status === 503) {
                // Si el modelo está cargando, esperamos 2 segundos y reintentamos
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }

            if (!response.ok) throw new Error("Servidor saturado");

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');

            return res.status(200).json({ url: `data:image/png;base64,${base64Image}` });

        } catch (error) {
            if (i === 2) return res.status(500).json({ error: "La IA sigue ocupada. Prueba en 10 segundos." });
        }
    }
}
