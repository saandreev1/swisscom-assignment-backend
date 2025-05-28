import { Request, Response } from 'express';
import {
    createForm,
    getFormById,
    getForms,
    updateForm
} from './form.service';

export async function createFormHandler(req: Request, res: Response) {
    const { title } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required.' });
        return;
    }

    try {
        const form = await createForm(title, req.user!.userId);
        res.status(201).json(form);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create form.' });
    }
}

export async function updateFormTitleHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
        res.status(400).json({ error: 'Title is required and must be a string.' });
        return;
    }

    try {
        const updated = await updateForm(Number(id), title, req.user!.userId, req.user!.role === 'ADMIN');
        res.json(updated);
    } catch (err: any) {
        const status = err.message === 'Forbidden' ? 403 : 400;
        res.status(status).json({ error: err.message });
    }
}

export async function getFormsHandler(req: Request, res: Response) {
    const createdById = req.query.createdById ? Number(req.query.createdById) : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    const title = req.query.title?.toString();

    try {
        const forms = await getForms(createdById, title, page, pageSize);
        res.json(forms);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getFormByIdHandler(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const form = await getFormById(Number(id));
        res.json(form);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}