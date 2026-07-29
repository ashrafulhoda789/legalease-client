import { protectedFetch, serverFetch } from "../core/server";

export const getHiringRequest = async (userEmail) => {
    return protectedFetch(`/api/lawyer/hiring-requests?email=${encodeURIComponent(userEmail)}`);
}