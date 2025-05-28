import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    createQuestionHandler,
    updateQuestionHandler,
    deleteQuestionHandler,
    linkQuestionHandler,
    unlinkQuestionFromFormHandler,
    getQuestionsHandler,
    getQuestionByIdHandler,
} from './question.controller';

const router = Router();

/**
 * @openapi
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - type
 *             properties:
 *               text:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [TEXT, RATING, MULTIPLE_CHOICE]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question created
 */
router.post('/questions', authenticate, createQuestionHandler);

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: createdById
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by creator ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TEXT, RATING, MULTIPLE_CHOICE]
 *         required: false
 *         description: Filter by question type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search text
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination - page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination - page size
 *     responses:
 *       200:
 *         description: List of questions
 */
router.get('/questions', authenticate, getQuestionsHandler);

/**
 * @openapi
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question found
 */
router.get('/questions/:id', authenticate, getQuestionByIdHandler);

/**
 * @openapi
 * /api/questions/{id}:
 *   patch:
 *     summary: Update a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated
 */
router.patch('/questions/:id', authenticate, updateQuestionHandler);

/**
 * @openapi
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Question deleted
 */
router.delete('/questions/:id', authenticate, deleteQuestionHandler);

/**
 * @openapi
 * /api/forms/{formId}/questions/{questionId}:
 *   post:
 *     summary: Link a question to a form
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: formId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question linked to form
 */
router.post('/forms/:formId/questions/:questionId', authenticate, linkQuestionHandler);

/**
 * @openapi
 * /api/forms/{formId}/questions/{questionId}:
 *   delete:
 *     summary: Unlink a question from a form
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: formId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: questionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Question unlinked from form
 */
router.delete('/forms/:formId/questions/:questionId', authenticate, unlinkQuestionFromFormHandler);

export default router;