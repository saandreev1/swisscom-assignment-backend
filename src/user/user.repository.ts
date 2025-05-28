import prisma from '../prisma/prisma';
import { RegisterInput } from './user.types';

/**
 * Find a user by email
 */
export function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

/**
 * Create a new user
 */
export function createUserRecord(data: RegisterInput & { password: string }) {
    return prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            role: data.role
        }
    });
}

/**
 * Update a user's password
 */
export function updateUserPassword(userId: number, hashedPassword: string) {
    return prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
}