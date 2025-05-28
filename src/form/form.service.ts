import {
    updateFormTitle,
    createForm as createFormRecord,
    getFormById as fetchFormById,
    getFormsFiltered
} from './form.repository';

export async function createForm(title: string, userId: number) {
    return createFormRecord(title, userId);
}

export async function updateForm(id: number, title: string, userId: number, isAdmin: boolean) {
    const form = await getFormById(id);
    if (!form) throw new Error('Form not found');

    if (!isAdmin && form.createdById !== userId) {
        throw new Error('Forbidden');
    }

    return updateFormTitle(id, title);
}

export async function getForms(
    createdById?: number,
    title?: string,
    page?: number,
    pageSize?: number
) {
    return getFormsFiltered(createdById, title, page, pageSize);
}

export async function getFormById(id: number) {
    const form = await fetchFormById(id);
    if (!form) throw new Error('Form not found');
    return form;
}