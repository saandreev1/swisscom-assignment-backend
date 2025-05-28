import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma';

export function getFeedbackRequestWithQuestions(token: string) {
    return prisma.feedbackRequest.findUnique({
        where: { token },
        include: {
            feedback: true,
            form: {
                include: {
                    questions: {
                        include: { question: true }
                    }
                }
            }
        }
    });
}

export function createFeedbackWithAnswers(feedbackRequestId: number, answers: any[]) {
    return prisma.feedback.create({
        data: {
            feedbackRequestId,
            answers: {
                create: answers.map((a: any) => ({
                    questionId: a.questionId,
                    text: a.text,
                    rating: a.rating,
                    selected: a.selected
                }))
            }
        }
    });
}

export function getFeedbackById(id: number) {
    return prisma.feedback.findUnique({
        where: { id },
        include: {
            feedbackRequest: {
                include: {
                    form: true,
                    reviewer: true
                }
            },
            answers: {
                include: {
                    question: true
                }
            }
        }
    });
}

export function getFeedbackWithRequest(id: number) {
    return prisma.feedback.findUnique({
        where: { id },
        include: {
            feedbackRequest: true
        }
    });
}