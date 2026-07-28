import { serverFetch } from "../core/server";

export const getCategory = async () => {
    return serverFetch('/api/lawyers/category-counts');
}
