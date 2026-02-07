// api/generate.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { prompt } = req.query;
    
    // Esta es la variable que guardarás en Vercel
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN; 

    if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { 
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) throw new Error("Hugging Face está ocupado, intenta de nuevo.");

        // Recibimos la imagen como un "blob" (datos binarios)
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        return res.status(200).json({ 
            url: `data:image/png;base64,${base64Image}` 
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
