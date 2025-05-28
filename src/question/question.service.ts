import {
    createQuestion,
    updateQuestionById,
    getQuestionWithFormsAndAnswers,
    deleteQuestionById,
    linkQuestionToForm,
    unlinkQuestionFromForm,
    getFormQuestionLink,
    shiftQuestionsDown,
    getQuestionsFiltered
} from './question.repository';
import { getFormById } from '../form/form.repository';
import { QuestionType } from '@prisma/client';

export async function createGlobalQuestion(text: string, type: string, userId: number, options?: string[]) {
    return createQuestion(text, type as any, userId, options);
}

export async function getGlobalQuestion(id: number) {
    const q = await getQuestionWithFormsAndAnswers(id);
    if (!q) throw new Error('Question not found');
    return q;
}

export async function getGlobalQuestions(
    createdById?: number,
    type?: QuestionType,
    search?: string,
    page?: number,
    pageSize?: number
) {
    return getQuestionsFiltered(createdById, type, search, page, pageSize);
}

export async function updateGlobalQuestion(
    id: number,
    text: string,
    options: string[] | undefined,
    userId: number,
    isAdmin: boolean
) {
    const question = await getQuestionWithFormsAndAnswers(id);
    if (!question) throw new Error('Question not found');

    if (question.forms.length > 0) {
        throw new Error('Cannot update a question that is linked to a form');
    }

    if (question.answers.length > 0 && !isAdmin) {
        throw new Error('Cannot update a question that has answers');
    }

    if (!isAdmin && question.createdById !== userId) {
        throw new Error('Forbidden');
    }

    return updateQuestionById(id, { text, options });
}

export async function deleteGlobalQuestion(id: number, userId: number, isAdmin: boolean) {
    const question = await getQuestionWithFormsAndAnswers(id);
    if (!question) throw new Error('Question not found');

    if (question.forms.length > 0) {
        throw new Error('Cannot delete a question that is linked to a form');
    }

    if (question.answers.length > 0 && !isAdmin) {
        throw new Error('Cannot delete a question that has answers');
    }

    if (!isAdmin && question.createdById !== userId) {
        throw new Error('Forbidden');
    }

    return deleteQuestionById(id);
}

export async function attachQuestionToForm(
    formId: number,
    questionId: number,
    requesterId: number,
    isAdmin: boolean,
    requestedOrder?: number
) {
    const form = await getFormById(formId);
    if (!form) throw new Error('Form not found');
    if (!isAdmin && form.createdById !== requesterId) throw new Error('Forbidden');

    const existingLink = await getFormQuestionLink(formId, questionId);
    if (existingLink) throw new Error('Question already linked to this form');

    const insertAt = requestedOrder ?? 0;
    await shiftQuestionsDown(formId, insertAt);

    return linkQuestionToForm(formId, questionId, insertAt);
}

export async function detachQuestionFromForm(
    formId: number,
    questionId: number,
    userId: number,
    isAdmin: boolean
) {
    const form = await getFormById(formId);
    if (!form) throw new Error('Form not found');
    if (!isAdmin && form.createdById !== userId) throw new Error('Forbidden');

    return unlinkQuestionFromForm(formId, questionId);
}