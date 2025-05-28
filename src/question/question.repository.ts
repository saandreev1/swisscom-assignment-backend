import prisma from '../prisma/prisma';
import { Prisma, QuestionType } from '@prisma/client';

export function createQuestion(text: string, type: QuestionType, userId: number, options?: string[]) {
    return prisma.question.create({
        data: {
            text,
            type,
            createdById: userId,
            options: options ? (options as Prisma.InputJsonValue) : undefined
        }
    });
}

export function getQuestionWithFormsAndAnswers(id: number) {
    return prisma.question.findUnique({
        where: { id },
        include: {
            forms: true,
            answers: true,
            createdBy: true
        }
    });
}

export function getQuestionsFiltered(
    createdById?: number,
    type?: QuestionType,
    search?: string,
    page?: number,
    pageSize?: number
) {
    return prisma.question.findMany({
        where: {
            ...(createdById !== undefined ? { createdById } : {}),
            ...(type ? { type } : {}),
            ...(search ? { text: { contains: search } } : {})
        },
        include: {
            createdBy: true
        },
        orderBy: { createdAt: 'desc' },
        skip: page && pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize
    });
}

export function updateQuestionById(id: number, data: { text: string; options?: string[] }) {
    return prisma.question.update({
        where: { id },
        data: {
            text: data.text,
            options: data.options as any
        }
    });
}

export function deleteQuestionById(id: number) {
    return prisma.question.delete({ where: { id } });
}

export function getFormQuestionLink(formId: number, questionId: number) {
    return prisma.formQuestion.findFirst({ where: { formId, questionId } });
}

export function shiftQuestionsDown(formId: number, startOrder: number) {
    return prisma.formQuestion.updateMany({
        where: {
            formId,
            order: { gte: startOrder }
        },
        data: {
            order: { increment: 1 }
        }
    });
}

export function shiftQuestionsUp(formId: number, afterOrder: number) {
    return prisma.formQuestion.updateMany({
        where: {
            formId,
            order: { gt: afterOrder }
        },
        data: {
            order: { decrement: 1 }
        }
    });
}

export function linkQuestionToForm(formId: number, questionId: number, order: number) {
    return prisma.formQuestion.create({
        data: { formId, questionId, order }
    });
}

export async function unlinkQuestionFromForm(formId: number, questionId: number) {
    const toRemove = await prisma.formQuestion.findFirst({
        where: { formId, questionId }
    });

    if (!toRemove) return;

    await prisma.formQuestion.delete({ where: { id: toRemove.id } });

    await shiftQuestionsUp(formId, toRemove.order);
}