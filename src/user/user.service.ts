import bcrypt from 'bcryptjs';
import { RegisterInput } from './user.types';
import { createUserRecord, findUserByEmail, updateUserPassword as updateUserPasswordInDB } from './user.repository';


/**
 * Create a user with password hashing
 */
export async function createUser(data: RegisterInput) {
    const existing = await findUserByEmail(data.email);
    if (existing) throw new Error('User already exists.');

    const hashed = await bcrypt.hash(data.password, 10);
    return createUserRecord({ ...data, password: hashed });
}

/**
 * Lookup user by email
 */
export { findUserByEmail };

/**
 * Compare passwords
 */
export async function validatePassword(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
}

/**
 * Admin updates a user's password
 */
export async function updateUserPassword(userId: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return updateUserPasswordInDB(userId, hashed);
}