import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import NewsCard from "./NewsCard.jsx";

function PopularNews() {
    const [rankedArticles, setRankedArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRankedArticles = async () => {
            try {
                const rankRes = await fetch("https://crimearticle.net/article-service/rank");
                const json = await rankRes.json();
                console.log("🔥 랭킹 응답:", json);
                let rankIds = [];
                if (Array.isArray(json)) {
                    rankIds = json;
                }

                const articlePromises = rankIds.map((id) =>
                    fetch(`https://crimearticle.net/article-service/news/${id}`).then((res) => res.json())
                        .then((json) => json.data)
                );

                const articles = await Promise.all(articlePromises);
                setRankedArticles(articles);

                console.log(articles)
            } catch (error) {
                console.error("인기 뉴스 불러오기 실패:", error);
            }
        };

        fetchRankedArticles();
    }, []);

    return (
        <Wrapper>
            <h2>실시간 인기 뉴스</h2>
            <CardGrid>
                {rankedArticles.map((article, idx) => (
                    <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)}>
                        <NewsCard news={article} rank={idx}/>
                    </div>
                ))}
            </CardGrid>
        </Wrapper>
    );
}

export default PopularNews;

const Wrapper = styled.div`
    padding: 3rem 2rem;
    background: white;
    width: 100%;
    margin: 0 auto;
    max-width: 1600px;
    min-height: 800px; // 💡 한 화면 안에 다 보이도록 고정
    box-sizing: border-box;
    @media (max-width: 768px) {
        padding: 1rem;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        font-weight: bold;
        text-align: left;
        padding: 0 2rem;

        @media (max-width: 768px) {
            font-size: 1.25rem;
            text-align: center;
        }
    }
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 0 2rem;
    box-sizing: border-box;

    @media (max-width: 1200px) {
        padding: 0;
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
        padding: 0;
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        padding: 0;
        grid-template-columns: repeat(2, 1fr); /* ✅ 여전히 2개 유지 */
    }
`;
