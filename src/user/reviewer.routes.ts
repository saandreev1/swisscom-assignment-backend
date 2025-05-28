import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/require-role.middleware';
import {
    createReviewer,
    changeReviewerPassword
} from './reviewer.controller';

const router = Router();

/**
 * @openapi
 * /api/reviewers:
 *   post:
 *     summary: Create a new reviewer (Admin only)
 *     tags: [Reviewers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reviewer created
 *       403:
 *         description: Forbidden
 */
router.post('/reviewers', authenticate, requireRole('ADMIN'), createReviewer);

/**
 * @openapi
 * /api/reviewers/{id}/password:
 *   put:
 *     summary: Change a reviewer's password (Admin only)
 *     tags: [Reviewers]
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
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       403:
 *         description: Forbidden
 */
router.put('/reviewers/:id/password', authenticate, requireRole('ADMIN'), changeReviewerPassword);

export default router;