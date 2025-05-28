import { deleteFeedbackRequest, markFeedbackRequestSubmitted } from '../feedback-request/feedback-request.repository';
import {
    getFeedbackRequestWithQuestions,
    createFeedbackWithAnswers,
    getFeedbackById as fetchById,
    getFeedbackWithRequest
} from './feedback.repository';

export async function submitFeedback(token: string, answers: any[]) {
    const request = await getFeedbackRequestWithQuestions(token);

    if (!request) throw new Error('Invalid token');
    if (request.feedback) throw new Error('Feedback already submitted');

    const questionMap = new Map(
        request.form.questions.map(q => [q.questionId, q.question])
    );

    for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (!question) {
            throw new Error(`Question with ID ${answer.questionId} is not part of the form`);
        }

        switch (question.type) {
            case 'TEXT':
                if (typeof answer.text !== 'string') {
                    throw new Error(`Answer to question with ID ${question.id} must be a string`);
                }
                break;

            case 'RATING':
                if (typeof answer.rating !== 'number') {
                    throw new Error(`Answer to question with ID ${question.id} must be a number`);
                }
                break;

            case 'MULTIPLE_CHOICE':
                if (!Array.isArray(answer.selected)) {
                    throw new Error(`Answer to question with ID ${question.id} must be a list`);
                }
                if (!Array.isArray(question.options)) {
                    throw new Error(`Question with ID ${question.id} has no valid options defined`);
                }

                const options = question.options as string[];
                const invalid = answer.selected.find(
                    (option: string) => !options.includes(option)
                );
                if (invalid) {
                    throw new Error(`Invalid option "${invalid}" for question with ID ${question.id}`);
                }
                break;

            default:
                throw new Error(`Unsupported question type for question with ID ${question.id}`);
        }
    }

    const feedback = await createFeedbackWithAnswers(request.id, answers);
    await markFeedbackRequestSubmitted(request.id);

    return feedback;
}

export async function getFeedbackById(id: number) {
    return fetchById(id);
}

export async function deleteFeedback(id: number, userId: number, isAdmin: boolean) {
    const feedback = await getFeedbackWithRequest(id);
    if (!feedback) throw new Error('Feedback not found');

    const requestOwner = feedback.feedbackRequest.reviewerId;

    if (!isAdmin && userId !== requestOwner) {
        throw new Error('Forbidden');
    }

    return deleteFeedbackRequest(feedback.feedbackRequest.id);
}
