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
 */
router.post('/forms', authenticate, createFormHandler);

/**
 * @openapi
 * /api/forms/{id}:
 *   patch:
 *     summary: Update form title
 *     tags: [Forms]
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
 *         required: false
 *         description: Filter by creator ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by form title (partial match)
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
 *         description: A list of forms
 */
router.get('/forms', authenticate, getFormsHandler);

/**
 * @openapi
 * /api/forms/{id}:
 *   get:
 *     summary: Get form by ID
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Form details
 */
router.get('/forms/:id', authenticate, getFormByIdHandler);

export default router;