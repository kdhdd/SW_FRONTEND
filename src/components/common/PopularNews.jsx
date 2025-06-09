import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

function PopularNews() {
    const [rankedArticles, setRankedArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRankedArticles = async () => {
            try {
                const rankRes = await fetch("http://localhost:8080/rank");
                const rankIds = await rankRes.json();

                const articlePromises = rankIds.map(id =>
                    fetch(`http://localhost:8080/news/${id}`).then(res => res.json())
                );

                const articles = await Promise.all(articlePromises);
                setRankedArticles(articles);
            } catch (error) {
                console.error("인기 뉴스 불러오기 실패:", error);
            }
        };

        fetchRankedArticles();
    }, []);

    const leftItems = rankedArticles.slice(0, 5);
    const rightItems = rankedArticles.slice(5, 10);

    return (
        <Wrapper>
            <h2>🔥 실시간 인기 뉴스</h2>
            <NewsGrid>
                <Column>
                    {leftItems.map((article, idx) => (
                        <ArticleItem key={article.id}>
                            <span className="rank">{idx + 1}</span>
                            <span
                                className="title"
                                dangerouslySetInnerHTML={{__html: article.title}}
                                onClick={() => navigate(`/articles/${article.id}`)} // ✅ 이동
                                style={{cursor: "pointer"}} // ✅ 마우스 커서
                            />
                            <span className="count">{article.likes}❤️ {article.commentCount}💬</span>
                        </ArticleItem>
                    ))}
                </Column>
                <Column>
                    {rightItems.map((article, idx) => (
                        <ArticleItem key={article.id}>
                            <span className="rank">{idx + 6}</span>
                            <span
                                className="title"
                                dangerouslySetInnerHTML={{__html: article.title}}
                                onClick={() => navigate(`/articles/${article.id}`)} // ✅ 이동
                                style={{cursor: "pointer"}} // ✅ 마우스 커서
                            />
                            <span className="count">{article.likes}❤️ {article.commentCount}💬</span>
                        </ArticleItem>
                    ))}
                </Column>
            </NewsGrid>
        </Wrapper>
    );
}

export default PopularNews;

const Wrapper = styled.div`
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1100px;
    background: rgba(0, 0, 0, 0.8);
    padding: 1.5rem;
    border-radius: 1rem;
    color: #fff;
    z-index: 2;
    font-family: 'Pretendard', sans-serif;

    h2 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        font-weight: bold;
        color: #ffd700;
        text-align: center;
    }
`;

const NewsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const ArticleItem = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    font-size: 0.95rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.4rem;
    gap: 0.6rem;

    .rank {
        color: #00ffff;
        font-weight: bold;
    }

    .title {
        min-width: 0; /* ✅ 중요: 줄바꿈 방지와 text-overflow 작동 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .count {
        font-size: 0.85rem;
        color: #ccc;
        white-space: nowrap;
    }
`;
