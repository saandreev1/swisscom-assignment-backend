import { FeedbackRequestStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
    createFeedbackRequest,
    getFeedbackRequestById,
    getFeedbackRequestsFiltered,
    getFeedbackRequestByToken,
    deleteFeedbackRequest as removeFeedbackRequest,
} from './feedback-request.repository';
import { getFormById } from '../form/form.repository';
import { sendFeedbackRequestEmail } from '../utils/mailer';

export async function createRequest(
    candidateEmail: string,
    formId: number,
    reviewerId: number,
    candidateName?: string
) {
    const form = await getFormById(formId);
    if (!form) throw new Error('Form not found');

    if (form.questions.length === 0) {
        throw new Error('Form must contain at least one question before it can be used');
    }

    const token = randomUUID();
    const request = await createFeedbackRequest(
        candidateEmail,
        formId,
        reviewerId,
        token,
        candidateName
    );

    await sendFeedbackRequestEmail(candidateEmail, token, candidateName);

    return request;
}

export async function getFeedbackRequests(
    reviewerId?: number,
    status?: FeedbackRequestStatus,
    formId?: number,
    candidateEmail?: string,
    candidateName?: string,
    page?: number,
    pageSize?: number
) {
    return getFeedbackRequestsFiltered(
        reviewerId,
        status,
        formId,
        candidateEmail,
        candidateName,
        page,
        pageSize
    );
}

export async function getRequestWithFormByToken(token: string) {
    return getFeedbackRequestByToken(token)
}

export async function deleteFeedbackRequest(
    requestId: number,
    currentUserId: number,
    isAdmin: boolean
) {
    const request = await getFeedbackRequestById(requestId);
    if (!request) throw new Error('Feedback request not found');

    if (!isAdmin && request.reviewerId !== currentUserId) {
        throw new Error('Forbidden');
    }

    return removeFeedbackRequest(requestId);
}
