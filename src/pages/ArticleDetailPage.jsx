import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
import CommentForm from "../components/comments/CommentForm.jsx";
import ReplyForm from "../components/comments/ReplyForm.jsx";

function ArticleDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyFormVisibleId, setReplyFormVisibleId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        fetch("http://localhost:8080/users/me", {
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCurrentUser(data.data);
                console.log("currentUser:", data.data);
            })
            .catch((err) => {
                console.error("로그인 사용자 정보 불러오기 실패", err);
            });
    }, []);

    const fetchArticle = async () => {
        try {
            const res = await fetch(`http://localhost:8080/news/${id}`);
            const data = await res.json();
            setArticle(data);
        } catch (err) {
            console.error("기사 불러오기 실패:", err);
        }
    };

    const fetchComments = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8080/comments/${id}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });
            const data = await res.json();
            const commentList = Array.isArray(data.data) ? data.data : [];
            setComments(commentList);
            console.log("comments:", commentList);
        } catch (error) {
            console.error("댓글 불러오기 실패:", error);
            setComments([]);
        }
    };

    const fetchLikes = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8080/articles/like/${id}`, {
                headers: {Authorization: token},
            });
            if (res.ok) {
                const data = await res.json();
                setLikesCount(data.likes);
                setLiked(data.liked); // true or false
            }
        } catch (error) {
            console.error("공감 정보 가져오기 실패:", error);
        }
    }

    useEffect(() => {
        fetchArticle();
        fetchComments();
        fetchLikes();
    }, [id]);

    if (!id || isNaN(parseInt(id))) {
        return <NotFound>유효하지 않은 기사 ID입니다.</NotFound>;
    }

    if (!article) {
        return <NotFound>기사를 불러오는 중입니다...</NotFound>;
    }

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
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
        const token = localStorage.getItem("accessToken");
        if (!editContent.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({content: editContent}),
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

    const handleLikeClick = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/articles/like/${id}`, {
                method: "POST",
                headers: {Authorization: token},
            });
            if (res.ok) {
                const data = await res.json(); // 예: { liked: true, likes: 5 }
                setLiked(data.liked);
                setLikesCount(data.likes);
            } else {
                alert("공감 처리 실패");
            }
        } catch (error) {
            console.error("공감 처리 오류:", error);
        }
    };


    return (
        <Wrapper>
            <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
            <Title dangerouslySetInnerHTML={{__html: article.title}}/>
            <Meta>{article.pubDate}</Meta>
            <GlobalStyles/>
            <Content
                dangerouslySetInnerHTML={{
                    __html: article.content
                        .replace(/data-src=/g, "src=")
                        .replace(/style="display:\s?none;?"/g, '')
                }}
            />
            <LikeButtonSection>
                <LikeButton
                    onClick={handleLikeClick}
                    className={liked ? "liked" : ""}
                >
                    {liked ? "❤️" : "🤍"} {likesCount} 공감
                </LikeButton>

            </LikeButtonSection>
            <CommentSection>
                <h3>댓글</h3>
                <CommentForm articleId={id} onCommentAdded={fetchComments}/>

                <StyledCommentList>
                    {comments
                        .filter((comment) => comment.parentId == null)
                        .map((comment) => (
                            <li key={comment.id}>
                                <div className="meta">
                  <span>
                    {comment.nickname} <Role role={comment.role}>({comment.role})</Role>
                  </span>
                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <>
                    <textarea
                        rows="2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                                        <div className="actions">
                                            <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
                                            <button onClick={() => setEditingCommentId(null)}>취소</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="content">{comment.content}</div>
                                        <div className="actions">
                                            {currentUser?.username === comment.userId && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(comment.id);
                                                            setEditContent(comment.content);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                                </>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setReplyFormVisibleId((prev) =>
                                                        prev === comment.id ? null : comment.id
                                                    )
                                                }
                                            >
                                                {replyFormVisibleId === comment.id ? "답글 취소" : "답글쓰기"}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <ul style={{marginLeft: "20px"}}>
                                    {comments
                                        .filter(reply => reply.parentId === comment.id)
                                        .map(reply => (
                                            <li key={reply.id}>
                                                <div className="meta">
                                                    <span>{reply.nickname} <Role role={reply.role}>({reply.role})</Role></span>
                                                    <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                                </div>

                                                {editingCommentId === reply.id ? (
                                                    <>
            <textarea
                rows="2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
            />
                                                        <div className="actions">
                                                            <button onClick={() => handleUpdateComment(reply.id)}>저장
                                                            </button>
                                                            <button onClick={() => setEditingCommentId(null)}>취소
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="content">└ {reply.content}</div>
                                                        {currentUser?.username === reply.userId && (
                                                            <div className="actions">
                                                                <button onClick={() => {
                                                                    setEditingCommentId(reply.id);
                                                                    setEditContent(reply.content);
                                                                }}>수정
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(reply.id)}>삭제
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                </ul>

                                {replyFormVisibleId === comment.id && (
                                    <ReplyForm
                                        parentId={comment.id}
                                        articleId={id}
                                        onReplyAdded={() => {
                                            fetchComments();
                                            setReplyFormVisibleId(null);
                                        }}
                                    />
                                )}
                            </li>
                        ))}
                </StyledCommentList>
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

const Title = styled.h2`
    margin-top: 20px;
    font-size: 1.8rem;
`;

const Meta = styled.div`
    margin-top: 8px;
    color: gray;
    font-size: 0.9rem;
`;

const Content = styled.div`
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

const StyledCommentList = styled.ul`
    list-style: none;
    padding: 0;

    li {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: #888;
        }

        .content {
            font-size: 1rem;
        }

        .actions {
            display: flex;
            gap: 0.5rem;

            button {
                padding: 4px 12px;
                font-size: 0.9rem;
                border: none;
                border-radius: 4px;
                background: #f0f0f0;
                cursor: pointer;

                &:hover {
                    background: #ccc;
                }
            }
        }

        textarea {
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 8px;
        }
    }
`;

const GlobalStyles = createGlobalStyle`
    .nbd_table td {
        font-size: 0.85rem;
        color: #666;
        line-height: 1.4;
    }
`;

const Role = styled.span`
    color: ${({role}) => (role === "POLICE" ? "#007BFF" : "black")};
    font-weight: normal;
`;

const LikeButtonSection = styled.div`
    margin: 30px 0 10px;
    display: flex;
    justify-content: center;
`;

const LikeButton = styled.button`
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: transform 0.2s;

    &.liked {
        color: #e74c3c;
    }

    &:hover {
        transform: scale(1.1);
    }
`;
