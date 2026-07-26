import { serverFetch } from "../core/server";

export const getLawyers = async() =>{
    return serverFetch('/api/lawyers');
}

export const getLawyersById = async(lawyerId) =>{
    return serverFetch(`/api/lawyers/${lawyerId}`)
}