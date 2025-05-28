import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'My API', version: '1.0.0' },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.resolve(__dirname, '../**/*.routes.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;