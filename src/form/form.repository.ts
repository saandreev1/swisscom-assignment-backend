import prisma from '../prisma/prisma';

export function createForm(title: string, createdById: number) {
    return prisma.form.create({
        data: {
            title,
            createdById
        }
    });
}

export function updateFormTitle(id: number, title: string) {
    return prisma.form.update({
        where: { id },
        data: { title }
    });
}

export function getFormById(id: number) {
    return prisma.form.findUnique({
        where: { id },
        include: {
            createdBy: true,
            questions: {
                orderBy: { order: 'asc' },
                include: {
                    question: true
                }
            }
        }
    });
}

export function getFormsFiltered(
    createdById?: number,
    title?: string,
    page?: number,
    pageSize?: number
) {
    return prisma.form.findMany({
        where: {
            ...(createdById !== undefined ? { createdById } : {}),
            ...(title
                ? { title: { contains: title } }
                : {}),
        },
        include: {
            createdBy: true,
            questions: {
                include: { question: true },
            },
        },
        orderBy: { id: 'desc' },
        skip: page && pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
    });
}