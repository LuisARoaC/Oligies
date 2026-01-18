export default async function handler(req, res) {
    const { prompt } = JSON.parse(req.body);
    const HF_TOKEN = process.env.HF_TOKEN; // Vercel pondrá tu llave aquí automáticamente

    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: { Authorization: `Bearer ${HF_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });
}
