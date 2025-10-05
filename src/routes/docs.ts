import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const router = express.Router();

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  },
  customSiteTitle: 'TikTok Live Connector API Documentation',
  customfavIcon: '/favicon.ico',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #ff0050 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin: 20px 0; }
  `
};

// Serve Swagger UI
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

// Serve raw OpenAPI spec
router.get('/docs/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/x-yaml');
  res.sendFile(path.join(__dirname, '../../docs/openapi.yaml'));
});

router.get('/docs/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

// Redirect root /api to docs
router.get('/', (req, res) => {
  res.redirect('/api/docs');
});

export default router;