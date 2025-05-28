import express from 'express';
import userRoutes from './user/user.routes';
import reviewerRoutes from './user/reviewer.routes';
import formRoutes from './form/form.routes';
import questionRoutes from './question/question.routes';
import feedbackRequestRoutes from './feedback-request/feedback-request.routes';
import feedbackRoutes from './feedback/feedback.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger'
import { initTestData } from './scripts/initTestData';


const cors = require('cors');

const app = express();

// Script to populate the database for testing purposes
initTestData();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', userRoutes);
app.use('/api', reviewerRoutes);
app.use('/api', formRoutes);
app.use('/api', questionRoutes);
app.use('/api', feedbackRequestRoutes);
app.use('/api', feedbackRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});