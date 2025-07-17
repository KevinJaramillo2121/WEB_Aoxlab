    // server.js

    // 1. Importar las dependencias que instalamos
    const express = require('express');
    const OpenAI = require('openai');
    const cors = require('cors');
    require('dotenv').config(); // Carga las variables del archivo .env

    // 2. Inicializar el servidor Express y OpenAI
    const app = express();
    const port = 3000; // El puerto donde se ejecutará nuestro servidor

    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Carga la API Key de forma segura
    });

    // 3. Configurar los Middlewares
    app.use(cors()); // Permite peticiones desde tu frontend
    app.use(express.json()); // Permite al servidor entender JSON que envía el frontend

    // 4. Definir el prompt del sistema para el asistente de Aoxlab
    // (Tomado de tu archivo Inicio.js y mejorado ligeramente)
    const systemPrompt = `Eres un asistente virtual experto de AOXLAB, un laboratorio de análisis y certificación en Medellín, Colombia. Tu nombre es Andi.
    Tu misión es ser profesional, amable, y conciso.
    - **Sobre AOXLAB**: Laboratorio especializado en análisis microbiológicos, fisicoquímicos, metales pesados y cannabinoides. Ubicado en Calle 32F #74B-122, Laureles, Medellín. Teléfono: (604) 604-7454. Email: direccioncomercial@aoxlab.com.
    - **Servicios Principales**: Ofrecemos un portafolio amplio que incluye análisis de Alimentos, Cannabis Medicinal, Calidad de Aire, Cosméticos y Biodegradabilidad. También realizamos estudios de vida útil y cronogramas de microbiología.
    - **Certificaciones**: Contamos con acreditación ISO/IEC 17025:2017 y estamos próximos a obtener la ISO 17065.
    - **Instrucciones**:
    - Responde siempre en español.
    - Si te preguntan por una cotización, un servicio muy específico o algo que no sepas, dirige amablemente al usuario a los canales oficiales: "Para darte información precisa sobre tu cotización, te recomiendo contactar a nuestro equipo comercial al correo direccioncomercial@aoxlab.com o a través de nuestro WhatsApp."
    - Sé breve y directo. No uses más de 150 palabras por respuesta.`;

    // 5. Crear la ruta (endpoint) para el chat
    app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
        return res.status(400).json({ error: 'El mensaje es requerido.' });
        }

        // Realizar la petición a la API de OpenAI
        const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Modelo eficiente y económico
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        max_tokens: 150, // Limita la longitud (y el costo) de la respuesta
        temperature: 0.7, // Un buen balance entre creatividad y consistencia
        });

        const botResponse = completion.choices[0].message.content;
        res.json({ message: botResponse.trim() });

    } catch (error) {
        console.error('Error al conectar con OpenAI:', error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud. Por favor, inténtalo más tarde.' });
    }
    });

    // 6. Iniciar el servidor
    app.listen(port, () => {
    console.log(`Servidor de Aoxlab escuchando en http://localhost:${port}`);
    });