'use server'

import { serverMutation } from "../core/server";

export const createComment = async(commentData) =>{
    return await serverMutation(`/api/comments`, commentData, 'POST')
}

export const updateComment = async (commentId, updatedData) => {

    const result = await serverMutation(
        `/api/comments/${commentId}`,
        updatedData,
        'PATCH'
    );
    return result;

};

export const deleteComment = async (commentId) => {

    const result = await serverMutation(
        `/api/comments/${commentId}`,
        {},
        'DELETE'
    );
    return result;
};