import { serverFetch } from "../core/server";

export const getComments = async () => {
    return serverFetch('/api/comments/user');
}