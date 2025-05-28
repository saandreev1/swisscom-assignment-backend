import { PrismaClient, QuestionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@swisscom.com';
const ADMIN_PASSWORD = 'secret123';

export async function initTestData() {
    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
        console.log('Admin already exists. Skipping test data init.');
        await prisma.$disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin
    const admin = await prisma.user.create({
        data: {
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Create questions
    const q1 = await prisma.question.create({
        data: {
            text: 'How was your interview experience?',
            type: QuestionType.TEXT,
            createdById: admin.id,
        },
    });

    const q2 = await prisma.question.create({
        data: {
            text: 'How would you rate the interviewer?',
            type: QuestionType.RATING,
            createdById: admin.id,
        },
    });

    const q3 = await prisma.question.create({
        data: {
            text: 'What aspect of the interview did you like the most?',
            type: QuestionType.MULTIPLE_CHOICE,
            options: JSON.stringify(['Environment', 'Questions', 'Pace']),
            createdById: admin.id,
        },
    });

    // Create form
    const form = await prisma.form.create({
        data: {
            title: 'Interview Feedback Form',
            createdById: admin.id,
        },
    });

    // Link questions to form
    await prisma.formQuestion.createMany({
        data: [
            { formId: form.id, questionId: q1.id, order: 1 },
            { formId: form.id, questionId: q2.id, order: 2 },
            { formId: form.id, questionId: q3.id, order: 3 },
        ],
    });

    const formSimple = await prisma.form.create({
        data: {
            title: 'Basic Feedback Form',
            createdById: admin.id,
        },
    });

    await prisma.formQuestion.create({
        data: {
            formId: formSimple.id,
            questionId: q1.id,
            order: 1,
        },
    });

    console.log('Admin, questions, and form initialized.');

    await prisma.$disconnect();
}
