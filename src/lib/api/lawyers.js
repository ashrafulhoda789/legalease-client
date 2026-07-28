import { serverFetch } from "../core/server";

export const getLawyers = async (queryString = '') => {
    return serverFetch(`/api/lawyers?${queryString}`,
        {
            cache: 'no-store'
        }
    );
}

export const getLawyersById = async (lawyerId) => {
    return serverFetch(`/api/lawyers/${lawyerId}`)
}

export const getLawyerProfile = async (email) => {
    if (!email) return null;
    return await serverFetch(`/api/lawyer-profile/${email}`);
};


export const getTopHiredLawyers = async () => {
    return serverFetch('/api/lawyers/top-hired', {
        cache: 'no-store'
    });
};