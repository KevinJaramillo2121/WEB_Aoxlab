// backend/server.js

// 1. Importar las dependencias que instalamos
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env
const path = require('path'); // <-- ¡MOVER ESTA LÍNEA AQUÍ ARRIBA!

// 2. Inicializar el servidor Express y OpenAI
const app = express();
// const port = 3000; // Comenta o elimina esta línea
const port = process.env.PORT || 3000; // Usa la variable de entorno PORT si existe, sino 3000

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Carga la API Key de forma segura
});

// 3. Configurar los Middlewares
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite al servidor entender JSON que envía el frontend

// === NUEVAS Y CORREGIDAS LÍNEAS PARA SERVIR EL FRONTEND ===
// La ruta 'path.join(__dirname, '..')' es crucial.
// '__dirname' es 'backend/'
// '..' sube un nivel, apuntando a la raíz de tu repositorio donde está index.html
app.use(express.static(path.join(__dirname, '..')));

// Para cualquier otra solicitud GET que no haya sido manejada por una ruta anterior,
// devuelve el index.html. Esto es para que al visitar https://web-aoxlab.onrender.com
// se cargue tu página principal.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
// =========================================================

// 4. Definir el prompt del sistema para el asistente de Aoxlab
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
// ¡IMPORTANTE!: Esta ruta '/api/chat' debe estar definida ANTES del 'app.get('*')'
// para que el servidor intente coincidir con '/api/chat' primero.
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'El mensaje es requerido.' });
        }

        // Realizar la petición a la API de OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const botResponse = completion.choices[0].message.content;
        res.json({ message: botResponse.trim() });

    } catch (error) {
        console.error('Error al conectar con OpenAI:', error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud. Por favor, inténtalo más tarde.' });
    }
});

// Ruta para verificar el estado del servidor (health check)
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running healthy!' });
});

// 6. Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de Aoxlab escuchando en http://localhost:${port}`);
});