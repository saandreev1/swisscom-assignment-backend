import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    createFormHandler,
    getFormByIdHandler,
    getFormsHandler,
    updateFormTitleHandler
} from './form.controller';

const router = Router();

/**
 * @openapi
 * /api/forms:
 *   post:
 *     summary: Create a new form
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Form created
 *       400:
 *         description: Title is required.
 *       500:
 *         description: Failed to create form.
 */
router.post('/forms', authenticate, createFormHandler);

/**
 * @openapi
 * /api/forms/{id}:
 *   patch:
 *     summary: Update form title
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Form updated
 *       400:
 *         description: Title is required and must be a string.
 *       403:
 *         description: Forbidden
 */
router.patch('/forms/:id', authenticate, updateFormTitleHandler);

/**
 * @openapi
 * /api/forms:
 *   get:
 *     summary: Get all forms
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: createdById
 *         schema:
 *           type: integer
 *       - in: query
 *         name: title
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
 *         description: A list of forms
 *       400:
 *         description: [dynamic error message]
 */
router.get('/forms', authenticate, getFormsHandler);

/**
 * @openapi
 * /api/forms/{id}:
 *   get:
 *     summary: Get form by ID
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Form details
 *       404:
 *         description: [dynamic error message]
 */
router.get('/forms/:id', authenticate, getFormByIdHandler);

export default router;