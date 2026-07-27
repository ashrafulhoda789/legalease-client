import { serverFetch } from "../core/server";

export const getCheckHiring = async () => {
    return serverFetch('/api/check-hiring');
}