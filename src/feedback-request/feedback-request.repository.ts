import prisma from '../prisma/prisma';
import { FeedbackRequestStatus, Prisma } from '@prisma/client';

export function createFeedbackRequest(candidateEmail: string, formId: number, reviewerId: number, token: string, candidateName?: string) {
    return prisma.feedbackRequest.create({
        data: {
            candidateEmail,
            formId,
            reviewerId,
            token,
            candidateName,
        }
    });
}

export function markFeedbackRequestSubmitted(id: number) {
    return prisma.feedbackRequest.update({
        where: { id },
        data: { status: 'SUBMITTED' }
    });
}

export function getFeedbackRequestsFiltered(
    reviewerId?: number,
    status?: FeedbackRequestStatus,
    formId?: number,
    candidateEmail?: string,
    candidateName?: string,
    page?: number,
    pageSize?: number
) {
    return prisma.feedbackRequest.findMany({
        where: {
            ...(reviewerId !== undefined ? { reviewerId } : {}),
            ...(status ? { status } : {}),
            ...(formId !== undefined ? { formId } : {}),
            ...(candidateEmail ? { candidateEmail } : {}),
            ...(candidateName
                ? { candidateName: { contains: candidateName, mode: 'insensitive' } as Prisma.StringNullableFilter }
                : {})
        },
        include: {
            form: true,
            reviewer: true,
            feedback: {
                include: {
                    answers: {
                        include: {
                            question: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        skip: page && pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize
    });
}

export function getFeedbackRequestById(id: number) {
    return prisma.feedbackRequest.findUnique({
        where: { id },
        include: {
            reviewer: true,
            feedback: true
        }
    });
}

export function getFeedbackRequestByToken(token: string) {
    return prisma.feedbackRequest.findUnique({
        where: { token },
        include: {
            form: {
                include: {
                    questions: {
                        include: {
                            question: true
                        }
                    }
                }
            },
            feedback: true
        }
    })
}

export function deleteFeedbackRequest(id: number) {
    return prisma.feedbackRequest.delete({
        where: { id }
    });
}