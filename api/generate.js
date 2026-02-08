export default async function handler(req, res) {
    const { prompt } = req.query;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    const width = 800;
    const height = 1000;
    const model = 'flux';
    const seed = Math.floor(Math.random() * 1000000);

    // Si quieres usar la API Key aquí para mayor prioridad:
    // const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true&api_key=${process.env.POLLINATIONS_API_KEY}`;

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`;

    res.status(200).json({ url: imageUrl });
}
