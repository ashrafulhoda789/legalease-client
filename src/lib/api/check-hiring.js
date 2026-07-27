import { serverFetch } from "../core/server";


export const getCheckHiring = async (lawyerId, email, options = {}) => {
    if (!lawyerId || !email) return { isHired: false };

    // email এবং lawyerId দুটোই Query Parameter হিসেবে পাঠানো হচ্ছে
    return serverFetch(`/api/check-hiring?email=${encodeURIComponent(email)}&lawyerId=${lawyerId}`, options);
};