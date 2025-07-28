// backend/server.js

// 1. Importar las dependencias que instalamos
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env
const path = require('path'); // <--- ¡Mover esta línea AQUI ARRIBA! Es crucial que 'path' esté disponible.

// 2. Inicializar el servidor Express y OpenAI
const app = express();
const port = process.env.PORT; // Elimina el fallback a 3000
if (!port) {
    console.error("Error: PORT environment variable is not set by Render.");
    process.exit(1); // Salir si el puerto no está definido
} // Usa la variable de entorno PORT si existe, sino 3000

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Carga la API Key de forma segura
});

// === NUEVAS CONSTANTES DE CONFIGURACIÓN DE OPENAI PARA EL BACKEND ===
const OPENAI_MODEL = 'gpt-3.5-turbo'; // Asegúrate de que este sea el modelo que deseas usar
const OPENAI_MAX_TOKENS = 150;        // Puedes ajustar este valor si necesitas respuestas más largas
const OPENAI_TEMPERATURE = 0.7;       // Puedes ajustar la temperatura para variar la creatividad (0.0 a 1.0)
// ====================================================================

// 3. Configurar los Middlewares
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite al servidor entender JSON que envía el frontend

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

// 5. Crear las rutas (endpoints) de la API. Estas DEBEN ir ANTES de las rutas para servir el frontend.
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'El mensaje es requerido.' });
        }

        // Realizar la petición a la API de OpenAI
        const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL, // <-- ¡Cambio aquí!
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        max_tokens: OPENAI_MAX_TOKENS, // <-- ¡Cambio aquí!
        temperature: OPENAI_TEMPERATURE // <-- ¡Cambio aquí!
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

// === CONFIGURACIÓN PARA SERVIR EL FRONTEND ESTATICO ===
// Importante: Estas líneas deben ir DESPUÉS de tus rutas de API.

// 1. Sirve todos los archivos estáticos desde la raíz de tu repositorio.
//    path.join(__dirname, '..') es la clave: sube un nivel desde 'backend/'
//    para apuntar a la carpeta principal donde están index.html, Css/, Js/, etc.
app.use(express.static(path.join(__dirname, '..')));

// 2. Para cualquier otra solicitud GET que no coincida con una ruta de API o un archivo estático,
//    siempre devuelve tu 'index.html'. Esto es fundamental para las SPA (Single Page Applications)
//    y para que la URL principal del sitio web cargue tu página.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    });
// ======================================================

// 6. Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de Aoxlab escuchando en http://localhost:${port}`);
});