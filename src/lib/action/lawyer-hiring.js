import { serverMutation } from "../core/server";

export const createHireRequest = async (hireData) => {
    return await serverMutation('/api/hire-lawyer', hireData, 'POST');
};