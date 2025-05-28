import { Request, Response } from 'express';
import { createUser, updateUserPassword } from './user.service';

/**
 * Register a new reviewer
 */
export async function createReviewer(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const user = await createUser({ email, password, role: 'REVIEWER' });
        res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (err: any) {
        res.status(409).json({ error: err.message });
    }
}

/**
 * Change a reviewer's password
 */
export async function changeReviewerPassword(req: Request, res: Response) {
    const reviewerId = Number(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword) {
        res.status(400).json({ error: 'New password is required.' });
        return;
    }

    try {
        const updated = await updateUserPassword(reviewerId, newPassword);
        res.status(200).json({ message: 'Password updated.', reviewerId: updated.id });
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to update password.' });
    }
}