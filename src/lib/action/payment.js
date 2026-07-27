import { serverMutation } from "../core/server";

export const createPayment = async(data) =>{
    return await serverMutation(`/api/payments`, data, 'POST')
}
