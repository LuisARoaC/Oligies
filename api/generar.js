export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt } = JSON.parse(req.body);
        const token = process.env.HF_TOKEN;

        if (!token) return res.status(500).json({ error: "Falta HF_TOKEN en Vercel" });

        // Usamos SD-Turbo porque es el más rápido para evitar Timeouts
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (response.status === 503) {
            return res.status(503).json({ error: "Modelo cargando... reintenta" });
        }

        if (!response.ok) throw new Error("Error en Hugging Face");

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
