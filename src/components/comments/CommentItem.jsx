import React from "react";
import styled from "styled-components";

//import ReplyForm from "./ReplyForm.jsx";

function CommentItem({
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
                         //comments,
                         //fetchComments,
                         //articleId,
                         openMenuId,
                         toggleMenu
                     }) {
    const isEditing = editingCommentId === comment.id;
    const isOwn = currentUser?.username === comment.userId;
    //const replies = comments.filter(r => r.parentId === comment.id);

    return (
        <CommentContainer>
            <CommentBox className={comment.parentId ? "reply" : ""}>
                <Meta>
                    <TopRow>
                        <span>
                            {comment.nickname} <Role role={comment.role}>({comment.role})</Role>
                        </span>
                        {isOwn && (
                            <MenuWrapper>
                                <MenuButton onClick={() => toggleMenu(comment.id)}>⋯</MenuButton>
                                {openMenuId === comment.id && (
                                    <MenuDropdown>
                                        <button onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditContent(comment.content);
                                        }}>수정
                                        </button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                    </MenuDropdown>
                                )}
                            </MenuWrapper>
                        )}
                    </TopRow>
                </Meta>

                {isEditing ? (
                    <>
                        <textarea
                            rows="2"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <Actions>
                            <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
                            <button onClick={() => setEditingCommentId(null)}>취소</button>
                        </Actions>
                    </>
                ) : (
                    <>
                        <Content>{comment.parentId ? `└ ${comment.content}` : comment.content}</Content>
                        <InfoRow>
                            <span>{new Date(comment.createdAt).toLocaleString()}</span>
                            {/*    {!comment.parentId && (*/}
                            {/*    <ReplyButton*/}
                            {/*        onClick={() => setReplyFormVisibleId(prev => prev === comment.id ? null : comment.id)}*/}
                            {/*    >*/}
                            {/*        답글쓰기*/}
                            {/*    </ReplyButton>*/}
                            {/*)}*/}
                        </InfoRow>
                    </>
                )}

                {/*{replies.map(reply => (*/}
                {/*    <CommentItem*/}
                {/*        key={reply.id}*/}
                {/*        comment={reply}*/}
                {/*        currentUser={currentUser}*/}
                {/*        editContent={editContent}*/}
                {/*        setEditContent={setEditContent}*/}
                {/*        editingCommentId={editingCommentId}*/}
                {/*        setEditingCommentId={setEditingCommentId}*/}
                {/*        handleUpdateComment={handleUpdateComment}*/}
                {/*        handleDeleteComment={handleDeleteComment}*/}
                {/*        replyFormVisibleId={replyFormVisibleId}*/}
                {/*        setReplyFormVisibleId={setReplyFormVisibleId}*/}
                {/*        comments={comments}*/}
                {/*        fetchComments={fetchComments}*/}
                {/*        articleId={articleId}*/}
                {/*        openMenuId={openMenuId}*/}
                {/*        toggleMenu={toggleMenu}*/}
                {/*    />*/}
                {/*))}*/}

                {/*{replyFormVisibleId === comment.id && !comment.parentId && (*/}
                {/*    <ReplyForm*/}
                {/*        parentId={comment.id}*/}
                {/*        articleId={articleId}*/}
                {/*        onReplyAdded={() => {*/}
                {/*            fetchComments();*/}
                {/*            setReplyFormVisibleId(null);*/}
                {/*        }}*/}
                {/*    />*/}
                {/*)}*/}
            </CommentBox>
        </CommentContainer>
    );
}

export default CommentItem;

const CommentContainer = styled.div`
    list-style: none;
`;

const CommentBox = styled.div`
    width: 320px;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;

    &.reply {
        width: 280px;
        background-color: #f1f1f1;
        margin-top: 10px;
    }
`;

const Meta = styled.div`
    font-size: 0.85rem;
    color: #888;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Role = styled.span`
    color: ${({role}) => (role === "POLICE" ? "#007BFF" : "black")};
    font-weight: normal;
`;

const MenuWrapper = styled.div`
    position: relative;
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: #888;
`;

const MenuDropdown = styled.div`
    position: absolute;
    top: 24px;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    z-index: 10;
    padding: 8px 0;
    min-width: 80px;

    button {
        background: none;
        border: none;
        width: 100%;
        padding: 8px 16px;
        text-align: left;
        font-size: 0.95rem;
        color: #222;
        cursor: pointer;

        &:hover {
            background-color: #f5f5f5;
        }
    }
`;

const Content = styled.div`
    font-size: 1rem;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #888;
`;

const ReplyButton = styled.button`
    background: none;
    border: none;
    font-size: 0.85rem;
    color: #888;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 0.5rem;

    button {
        padding: 4px 12px;
        font-size: 0.9rem;
        border: none;
        border-radius: 4px;
        background: #e6f0ff;
        color: #007bff;
        cursor: pointer;

        &:hover {
            background: #d0e5ff;
        }
    }
`;
