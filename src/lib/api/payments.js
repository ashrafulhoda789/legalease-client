import { serverFetch } from "../core/server";

export const getAllPayments = async () => {
    return serverFetch('/api/payments');
}
