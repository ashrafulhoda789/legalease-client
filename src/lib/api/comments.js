import { serverFetch } from "../core/server";

export const getComments = async (email) => {
    if (!email) return { success: false, data: [] };
    return serverFetch(`/api/comments/user?email=${encodeURIComponent(email)}`);
};

export const getCommentsForSpecificLawyer = async(lawyerId) =>{
    return serverFetch(`/api/comments/lawyer/${lawyerId}`)
}

export const checkHiringStatus = async (email, lawyerId) => {
    if (!email || !lawyerId) return { isHired: false };
    return serverFetch(`/api/check-hiring?email=${encodeURIComponent(email)}&lawyerId=${lawyerId}`);
};