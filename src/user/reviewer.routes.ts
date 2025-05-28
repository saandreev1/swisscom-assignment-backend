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
 *       400:
 *         description: Email and password are required
 *       403:
 *         description: Forbidden (not an admin)
 *       409:
 *         description: Email already in use
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
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: New password is required
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Failed to update password
 */
router.put('/reviewers/:id/password', authenticate, requireRole('ADMIN'), changeReviewerPassword);

export default router;
