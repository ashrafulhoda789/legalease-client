'use server'

import { serverMutation } from "../core/server";

export const updateHiringRequest = async (id, status) => {
    return await serverMutation(`/api/lawyer/hiring-requests/${id}`, {status}, 'PATCH');
};