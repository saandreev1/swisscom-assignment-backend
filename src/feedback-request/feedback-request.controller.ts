import { Request, Response } from 'express';
import {
    createRequest,
    getFeedbackRequests,
    getRequestWithFormByToken,
    deleteFeedbackRequest,
} from './feedback-request.service';
import { FeedbackRequestStatus } from '@prisma/client';

export async function createFeedbackRequestHandler(req: Request, res: Response) {
    const { candidateEmail, formId, candidateName } = req.body;

    if (!candidateEmail || !formId) {
        res.status(400).json({ error: 'Candidate email and form ID are required.' });
        return;
    }

    try {
        const request = await createRequest(
            candidateEmail,
            formId,
            req.user!.userId,
            candidateName
        );
        res.status(201).json({ token: request.token, id: request.id });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getFeedbackRequestsHandler(req: Request, res: Response) {
    const {
        reviewerId,
        status,
        formId,
        candidateEmail,
        candidateName,
        page,
        pageSize
    } = req.query;

    try {
        const requests = await getFeedbackRequests(
            reviewerId ? Number(reviewerId) : undefined,
            status as FeedbackRequestStatus,
            formId ? Number(formId) : undefined,
            candidateEmail?.toString(),
            candidateName?.toString(),
            page ? Number(page) : undefined,
            pageSize ? Number(pageSize) : undefined
        );

        res.json(requests);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getFeedbackRequestByTokenHandler(req: Request, res: Response) {
    const { token } = req.params
    try {
        const request = await getRequestWithFormByToken(token)
        if (!request) {
            res.status(404).json({ error: 'Invalid or expired token.' });
            return;
        }

        if (request.status !== 'PENDING') {
            res.status(400).json({ error: 'This feedback request has already been submitted.' });
            return;
        }

        const questions = request.form.questions
            .sort((a, b) => a.order - b.order)
            .map(q => ({
                id: q.question.id,
                text: q.question.text,
                type: q.question.type,
                options: q.question.options
            }))

        res.json({
            id: request.id,
            candidateEmail: request.candidateEmail,
            candidateName: request.candidateName,
            form: {
                id: request.form.id,
                title: request.form.title,
                questions
            }
        })
        return;
    } catch (err: any) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}

export async function deleteFeedbackRequestHandler(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await deleteFeedbackRequest(Number(id), req.user!.userId, req.user!.role === 'ADMIN');
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}