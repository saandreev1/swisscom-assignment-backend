import { Router } from 'express';
import {
    createFeedbackRequestHandler,
    getFeedbackRequestsHandler,
    deleteFeedbackRequestHandler,
    getFeedbackRequestByTokenHandler
} from './feedback-request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/feedback-requests:
 *   post:
 *     summary: Create a new feedback request
 *     tags: [FeedbackRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateEmail
 *               - formId
 *             properties:
 *               candidateEmail:
 *                 type: string
 *               formId:
 *                 type: integer
 *               candidateName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback request created
 *       400:
 *         description: Candidate email and form ID are required.
 */
router.post('/feedback-requests', authenticate, createFeedbackRequestHandler);

/**
 * @openapi
 * /api/feedback-requests:
 *   get:
 *     summary: Get all feedback requests
 *     tags: [FeedbackRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewerId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUBMITTED, EXPIRED]
 *       - in: query
 *         name: formId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: candidateEmail
 *         schema:
 *           type: string
 *       - in: query
 *         name: candidateName
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
 *         description: A list of feedback requests
 *       400:
 *         description: [dynamic error message]
 */
router.get('/feedback-requests', authenticate, getFeedbackRequestsHandler);

/**
 * @openapi
 * /api/feedback-requests/token/{token}:
 *   get:
 *     summary: Get a feedback request by token (public access)
 *     tags: [FeedbackRequests]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Feedback request details
 *       400:
 *         description: This feedback request has already been submitted.
 *       404:
 *         description: Invalid or expired token.
 *       500:
 *         description: Internal server error
 */
router.get('/feedback-requests/token/:token', getFeedbackRequestByTokenHandler);

/**
 * @openapi
 * /api/feedback-requests/{id}:
 *   delete:
 *     summary: Delete a feedback request
 *     tags: [FeedbackRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Feedback request deleted
 *       400:
 *         description: [dynamic error message]
 */
router.delete('/feedback-requests/:id', authenticate, deleteFeedbackRequestHandler);

export default router;