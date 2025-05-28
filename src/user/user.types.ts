import { Role } from './constants/roles';

export interface RegisterInput {
    email: string;
    password: string;
    role: Role;
}
export interface LoginInput {
    email: string;
    password: string;
}