import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newsData from "../data/NewsList.jsx";
import styled from "styled-components";

function ArticleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = newsData.find((item) => item.id.toString() === id);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const fetchComments = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${id}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            const commentList = Array.isArray(data.comments) ? data.comments : [];
            setComments(commentList);
        } catch (error) {
            console.error("댓글 불러오기 실패:", error);
            setComments([]);
        }
    };

    useEffect(() => {
        if (article) fetchComments();
    }, [id, article]);

    if (!id || isNaN(parseInt(id))) {
        return <NotFound>유효하지 않은 기사 ID입니다.</NotFound>;
    }

    if (!article) {
        return <NotFound>기사를 찾는 중입니다...</NotFound>;
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
                credentials: "include",
            });
            if (res.ok) {
                setNewComment("");
                fetchComments();
            } else {
                alert("댓글 등록 실패");
            }
        } catch (err) {
            console.error("댓글 등록 오류:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                fetchComments();
            } else {
                alert("댓글 삭제 실패");
            }
        } catch (err) {
            console.error("댓글 삭제 오류:", err);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent }),
                credentials: "include",
            });
            if (res.ok) {
                setEditingCommentId(null);
                setEditContent("");
                fetchComments();
            } else {
                alert("댓글 수정 실패");
            }
        } catch (err) {
            console.error("댓글 수정 오류:", err);
        }
    };

    return (
        <Wrapper>
            <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
            <Image src={article.imageUrl} alt="기사 이미지" />
            <Title>{article.title}</Title>
            <Meta>
                {article.source} · {article.category} · {article.date} · 조회수 {article.views.toLocaleString()}
            </Meta>
            <Content>{article.description}</Content>

            <CommentSection>
                <h3>댓글</h3>
                <CommentInput>
                    <textarea
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                    />
                    <button onClick={handleAddComment}>등록</button>
                </CommentInput>
                <CommentList>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            {editingCommentId === comment.id ? (
                                <>
                                    <textarea
                                        rows="2"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    />
                                    <EditButtons>
                                        <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
                                        <button onClick={() => setEditingCommentId(null)}>취소</button>
                                    </EditButtons>
                                </>
                            ) : (
                                <>
                                    <p>{comment.content}</p>
                                    <EditButtons>
                                        <button onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditContent(comment.content);
                                        }}>수정</button>
                                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                    </EditButtons>
                                </>
                            )}
                        </li>
                    ))}
                </CommentList>
            </CommentSection>
        </Wrapper>
    );
}

export default ArticleDetailPage;

const Wrapper = styled.div`
    max-width: 800px;
    margin: 100px auto 40px;
    padding: 0 20px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: var(--main-color);
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 1rem;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
`;

const Title = styled.h2`
    margin-top: 20px;
    font-size: 1.8rem;
`;

const Meta = styled.div`
    margin-top: 8px;
    color: gray;
    font-size: 0.9rem;
`;

const Content = styled.p`
    margin-top: 20px;
    font-size: 1.05rem;
    line-height: 1.6;
`;

const NotFound = styled.div`
    margin-top: 150px;
    text-align: center;
    font-size: 1.2rem;
`;

const CommentSection = styled.div`
    margin-top: 40px;
`;

const CommentInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    textarea {
        width: 100%;
        padding: 10px;
        resize: none;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    button {
        align-self: flex-end;
        padding: 6px 14px;
        border: none;
        background-color: var(--main-color);
        color: white;
        border-radius: 6px;
        cursor: pointer;
    }
`;

const CommentList = styled.ul`
    list-style: none;
    padding: 0;

    li {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;

        p {
            margin-bottom: 6px;
        }

        textarea {
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #ccc;
            resize: none;
        }
    }
`;

const EditButtons = styled.div`
    display: flex;
    gap: 0.5rem;

    button {
        padding: 4px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #eee;
        &:hover {
            background: var(--main-color);
            color: white;
        }
    }
`;
