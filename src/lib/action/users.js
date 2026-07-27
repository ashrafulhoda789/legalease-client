'use server'

import { serverMutation } from "../core/server";

export const updateUserRole = async (data, userId) => {
    return await serverMutation(`/api/users/role/${userId}`, data, 'PATCH');
};

export const deleteUser = async (userId) => {

    const result = await serverMutation(
        `/api/users/${userId}`,
        {},
        'DELETE'
    );
    return result;
};