import { protectedFetch } from "../core/server";

export const getHiringHistory = async (userEmail) => {
   
    const query = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
    return protectedFetch(`/api/hiring-history${query}`);
};