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
 *       400:
 *         description: Text and type are required and must be strings OR Invalid question type OR Options must be a non-empty array for multiple choice questions
 *       401:
 *         description: Unauthorized
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TEXT, RATING, MULTIPLE_CHOICE]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of questions
 *       400:
 *         description: Invalid query parameters
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
 *       404:
 *         description: Question not found
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
 *       400:
 *         description: Text is required and must be a string OR Options must be a non-empty array if provided
 *       403:
 *         description: Forbidden
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
 *       400:
 *         description: Error deleting question
 *       403:
 *         description: Forbidden
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
 *       400:
 *         description: Error linking question
 *       403:
 *         description: Forbidden
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
 *       400:
 *         description: Error unlinking question
 *       403:
 *         description: Forbidden
 */
router.delete('/forms/:formId/questions/:questionId', authenticate, unlinkQuestionFromFormHandler);

export default router;