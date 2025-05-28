import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { LoginInput } from './user.types';
import { findUserByEmail, validatePassword } from './user.service';

dotenv.config();

/**
 * Log in and return a JWT
 */
export async function login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    const user = await findUserByEmail(email);
    if (!user || !(await validatePassword(password, user.password))) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    })
}