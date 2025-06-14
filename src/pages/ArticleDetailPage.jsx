import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";

import ArticleTitle from "../components/articles/ArticleTitle";
import ArticleContent from "../components/articles/ArticleContent";
import LikeButton from "../components/articles/LikeButton";
import CommentSection from "../components/comments/CommentSection";
import Footer from "../components/common/Footer.jsx";

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
    const [openMenuId, setOpenMenuId] = useState(null);
    const [sentimentData, setSentimentData] = useState([]);
    const [isSentimentLoading, setIsSentimentLoading] = useState(false);


    const toggleMenu = (id) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        fetch("http://localhost:8000/user-service/users/me", {
            headers: {Authorization: token},
        })
            .then((res) => res.json())
            .then((data) => setCurrentUser(data.data))
            .catch((err) => console.error("로그인 사용자 정보 불러오기 실패", err));
    }, []);

    const fetchArticle = async () => {
        try {
            const res = await fetch(`http://localhost:8000/article-service/news/${id}`);
            const data = await res.json();
            setArticle(data.data);
        } catch (err) {
            console.error("기사 불러오기 실패:", err);
        }
    };

    const fetchComments = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8000/article-service/comments/${id}`, {
                headers: {Authorization: token},
            });
            const data = await res.json();
            setComments(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error("댓글 불러오기 실패:", error);
        }
    };

    const fetchSentimentStats = async (prevData = []) => {
        setIsSentimentLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/sentiment-service/sentiments/${id}`);
            const json = await res.json();

            const newData = json.data;

            // 데이터가 완전히 똑같으면 아직 분석 반영 안된 것 → 재요청
            const isSame = JSON.stringify(prevData) === JSON.stringify(newData);

            if (!isSame && Array.isArray(newData) && newData.length > 0) {
                setSentimentData(newData);
                setIsSentimentLoading(false);
            } else {
                setTimeout(() => fetchSentimentStats(sentimentData), 500); // 1초 후 재시도
            }
        } catch (err) {
            console.error("감정 통계 조회 실패:", err);
            setIsSentimentLoading(false);
        }
    };


    const fetchLikes = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8000/article-service/articles/like/${id}`, {
                headers: {Authorization: token},
            });
            if (res.ok) {
                const data = await res.json();
                setLikesCount(data.data.likes);
                setLiked(data.data.liked);
            }
        } catch (error) {
            console.error("공감 정보 가져오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchArticle();
        fetchComments();
        fetchLikes();
        fetchSentimentStats(); // 초기 로딩 시 감정 통계도 함께
    }, [id]);

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`http://localhost:8000/article-service/comments/${commentId}`, {
                method: "DELETE",
                headers: {Authorization: token},
            });
            if (res.ok) {
                await fetchComments();
                await fetchSentimentStats(sentimentData);
            } else alert("댓글 삭제 실패");
        } catch (err) {
            console.error("댓글 삭제 오류:", err);
        }
    };

    const handleUpdateComment = async (commentId) => {
        const token = localStorage.getItem("accessToken");
        if (!editContent.trim()) return;
        try {
            const res = await fetch(`http://localhost:8000/article-service/comments/${commentId}`, {
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
                await fetchComments();
                await fetchSentimentStats(sentimentData);
            } else alert("댓글 수정 실패");
        } catch (err) {
            console.error("댓글 수정 오류:", err);
        }
    };

    const handleLikeClick = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("로그인이 필요합니다.");
        try {
            const res = await fetch(`http://localhost:8000/article-service/articles/like/${id}`, {
                method: "POST",
                headers: {Authorization: token},
            });
            if (res.ok) {
                const data = await res.json();
                setLiked(data.data.liked);
                setLikesCount(data.data.likes);
            } else alert("공감 처리 실패");
        } catch (error) {
            console.error("공감 처리 오류:", error);
        }
    };

    if (!id || isNaN(parseInt(id))) return <NotFound>유효하지 않은 기사 ID입니다.</NotFound>;
    if (!article) return <NotFound>기사를 불러오는 중입니다...</NotFound>;

    return (
        <>
            <Wrapper>
                <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
                <ArticleTitle title={article.title} date={article.pubDate}/>
                <GlobalStyles/>
                <ArticleContent content={article.content}/>
                <LikeButton liked={liked} count={likesCount} onClick={handleLikeClick}/>
                <CommentSection
                    articleId={id}
                    currentUser={currentUser}
                    comments={comments}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    editingCommentId={editingCommentId}
                    setEditingCommentId={setEditingCommentId}
                    handleUpdateComment={handleUpdateComment}
                    handleDeleteComment={handleDeleteComment}
                    replyFormVisibleId={replyFormVisibleId}
                    setReplyFormVisibleId={setReplyFormVisibleId}
                    fetchComments={fetchComments}
                    openMenuId={openMenuId}
                    toggleMenu={toggleMenu}
                    sentimentData={sentimentData}
                    isSentimentLoading={isSentimentLoading}
                    onCommentAdded={async () => {
                        await fetchComments();
                        await fetchSentimentStats(sentimentData); // 등록과 동시에 차트 새로고침
                    }}
                />
            </Wrapper>
            <Footer/>
        </>
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

const NotFound = styled.div`
    margin-top: 150px;
    text-align: center;
    font-size: 1.2rem;
`;

const GlobalStyles = createGlobalStyle`
    .nbd_table td {
        font-size: 0.85rem;
        color: #666;
        line-height: 1.4;
    }
`;