export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    try {
        const { prompt } = JSON.parse(req.body);

        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (response.status === 503) {
            return res.status(503).json({ error: "Modelo cargando, reintenta en 15s" });
        }

        if (!response.ok) throw new Error("Error en Hugging Face");

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
