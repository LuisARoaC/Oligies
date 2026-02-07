// api/generate.js
export default async function handler(req, res) {
    const { prompt } = req.query;
    
    // 1. Extraemos la API Key desde las variables de entorno del servidor
    const apiKey = process.env.POLLINATIONS_API_KEY; 

    const width = 800;
    const height = 1000;
    const model = 'flux'; // O el modelo que prefieras
    const seed = Math.floor(Math.random() * 1000000);

    // 2. Construimos la URL
    // Nota: Si es una clave de Pollinations, a veces se añade como parámetro &key= 
    // o se usa para validar la petición antes de enviarla.
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`;

    try {
        // 3. Opcional: Validar con la API Key si haces un fetch interno o 
        // simplemente devolver la URL si tu clave ya está vinculada a tu IP/Dominio
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Error generando la imagen" });
    }
}
