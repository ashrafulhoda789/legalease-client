'use server'

import { serverMutation } from "../core/server";

export const updateLawyerProfile = async (profileData) => {
    return await serverMutation('/api/lawyer-profile', profileData, 'PATCH');
};