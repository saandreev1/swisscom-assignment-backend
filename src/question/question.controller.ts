import { Request, Response } from 'express';
import {
    createGlobalQuestion,
    updateGlobalQuestion,
    deleteGlobalQuestion,
    attachQuestionToForm,
    detachQuestionFromForm,
    getGlobalQuestion,
    getGlobalQuestions
} from './question.service';
import { QuestionType } from '@prisma/client';

export async function createQuestionHandler(req: Request, res: Response) {
    const { text, type, options } = req.body;
    const userId = req.user?.userId;

    if (!text || typeof text !== 'string' || !type || typeof type !== 'string') {
        res.status(400).json({ error: 'Text and type are required and must be strings.' });
        return;
    }

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!['TEXT', 'RATING', 'MULTIPLE_CHOICE'].includes(type)) {
        res.status(400).json({ error: 'Invalid question type.' });
        return;
    }

    if (type === 'MULTIPLE_CHOICE') {
        if (!Array.isArray(options) || options.length === 0) {
            res.status(400).json({ error: 'Options must be a non-empty array for multiple choice questions.' });
            return;
        }
    }

    try {
        const question = await createGlobalQuestion(text, type, userId, options);
        res.status(201).json(question);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getQuestionByIdHandler(req: Request, res: Response) {
    try {
        const question = await getGlobalQuestion(Number(req.params.id));
        res.json(question);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}

export async function getQuestionsHandler(req: Request, res: Response) {
    const createdById = req.query.createdById ? Number(req.query.createdById) : undefined;
    const type = req.query.type as QuestionType;
    const search = req.query.search?.toString();
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

    try {
        const questions = await getGlobalQuestions(createdById, type, search, page, pageSize);
        res.json(questions);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function updateQuestionHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text is required and must be a string.' });
        return;
    }

    if (options !== undefined && (!Array.isArray(options) || options.length === 0)) {
        res.status(400).json({ error: 'Options must be a non-empty array if provided.' });
        return;
    }

    try {
        const updated = await updateGlobalQuestion(
            Number(id),
            text,
            options,
            req.user!.userId,
            req.user!.role === 'ADMIN'
        );
        res.json(updated);
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteQuestionHandler(req: Request, res: Response) {
    const { id } = req.params;

    try {
        await deleteGlobalQuestion(
            Number(id),
            req.user!.userId,
            req.user!.role === 'ADMIN'
        );
        res.status(204).send();
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}

export async function linkQuestionHandler(req: Request, res: Response) {
    const { formId, questionId } = req.params;
    const order = req.body?.order;

    try {
        const link = await attachQuestionToForm(
            Number(formId),
            Number(questionId),
            req.user!.userId,
            req.user!.role === 'ADMIN',
            order !== undefined ? Number(order) : undefined
        );

        res.status(201).json(link);
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}

export async function unlinkQuestionFromFormHandler(req: Request, res: Response) {
    const { formId, questionId } = req.params;

    try {
        await detachQuestionFromForm(
            Number(formId),
            Number(questionId),
            req.user!.userId,
            req.user!.role === 'ADMIN'
        );

        res.status(204).send();
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}