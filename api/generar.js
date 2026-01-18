export default async function handler(req, res) {
    // 1. Verificar que el método sea POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { prompt } = JSON.parse(req.body);
        const token = process.env.HF_TOKEN;

        // 2. Verificar si la variable de entorno existe
        if (!token) {
            console.error("ERROR: No se encontró HF_TOKEN en Vercel");
            return res.status(500).json({ error: "Configura la variable HF_TOKEN en Vercel" });
        }

        // Usamos un modelo más rápido (SD Turbo) para evitar el error de tiempo de espera (504)
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        // 3. Si Hugging Face está cargando el modelo (Error 503)
        if (response.status === 503) {
            return res.status(503).json({ error: "La IA se está encendiendo, reintenta en 10 segundos." });
        }

        // 4. Si hay otro error en la API de Hugging Face
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error de HF:", errorText);
            return res.status(response.status).json({ error: "Hugging Face respondió con error" });
        }

        // 5. Convertir la imagen a Base64
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) throw new Error("Imagen vacía");
        
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });

    } catch (error) {
        console.error("LOG DE ERROR:", error.message);
        return res.status(500).json({ error: "Error interno: " + error.message });
    }
}
