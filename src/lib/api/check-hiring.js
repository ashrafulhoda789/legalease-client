import { serverFetch } from "../core/server";


export const getCheckHiring = async (lawyerId, email, options = {}) => {
    if (!lawyerId || !email) return { isHired: false };

    return serverFetch(`/api/check-hiring?email=${encodeURIComponent(email)}&lawyerId=${lawyerId}`, options);
};