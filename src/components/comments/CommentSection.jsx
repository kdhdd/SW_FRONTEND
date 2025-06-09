import React from "react";
import styled from "styled-components";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentSection(
    {
        articleId,
        currentUser,
        comments,
        editContent,
        setEditContent,
        editingCommentId,
        setEditingCommentId,
        handleUpdateComment,
        handleDeleteComment,
        //replyFormVisibleId,
        //setReplyFormVisibleId,
        fetchComments,
        openMenuId,
        toggleMenu,
    }) {
    return (
        <Wrapper>
            <h3>댓글</h3>
            <CommentForm articleId={articleId} onCommentAdded={fetchComments}/>
            <TwoColumnWrapper>
                <div className="column left">
                    {comments.filter(c => c.parentId == null && c.role === "POLICE").map(comment => (
                        <CommentItem key={comment.id} {...{
                            comment,
                            currentUser,
                            editContent,
                            setEditContent,
                            editingCommentId,
                            setEditingCommentId,
                            handleUpdateComment,
                            handleDeleteComment,
                            //replyFormVisibleId,
                            //setReplyFormVisibleId,
                            comments,
                            fetchComments,
                            articleId,
                            openMenuId,
                            toggleMenu,
                        }} />
                    ))}
                </div>
                <div className="column right">
                    {comments.filter(c => c.parentId == null && c.role === "USER").map(comment => (
                        <CommentItem key={comment.id} {...{
                            comment,
                            currentUser,
                            editContent,
                            setEditContent,
                            editingCommentId,
                            setEditingCommentId,
                            handleUpdateComment,
                            handleDeleteComment,
                            //replyFormVisibleId,
                            //setReplyFormVisibleId,
                            comments,
                            fetchComments,
                            articleId,
                            openMenuId,
                            toggleMenu,
                        }} />
                    ))}
                </div>
            </TwoColumnWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 40px;
`;

const TwoColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    .column {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .left {
        align-items: flex-start;
    }

    .right {
        align-items: flex-end;
    }
`;
