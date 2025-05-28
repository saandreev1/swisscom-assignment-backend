import { Request, Response } from 'express';
import {
    submitFeedback,
    getFeedbackById,
    deleteFeedback
} from './feedback.service';

export async function submitFeedbackHandler(req: Request, res: Response) {
    const { token } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ error: 'Answers must be an array' });
        return;
    }

    try {
        await submitFeedback(token, answers);
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getFeedbackHandler(req: Request, res: Response) {
    const { id } = req.params;
    const feedback = await getFeedbackById(Number(id));

    if (!feedback) {
        res.status(404).json({ error: 'Feedback not found' });
        return;
    }

    res.json(feedback);
}

export async function deleteFeedbackHandler(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await deleteFeedback(Number(id), req.user!.userId, req.user!.role === 'ADMIN');
        res.status(204).send();
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}