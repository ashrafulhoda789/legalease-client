import { serverFetch } from "../core/server";

export const getHiringRequest = async (userEmail) => {
    return serverFetch(`/api/lawyer/hiring-requests?email=${encodeURIComponent(userEmail)}`);
}