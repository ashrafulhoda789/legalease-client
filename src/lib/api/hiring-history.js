import { serverFetch } from "../core/server";

export const getHiringHistory = async (userEmail) => {
   
    const query = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
    return serverFetch(`/api/hiring-history${query}`);
};