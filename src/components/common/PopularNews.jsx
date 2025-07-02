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
                const rankRes = await fetch("http://localhost:8000/article-service/rank");
                const json = await rankRes.json();
                console.log("🔥 랭킹 응답:", json);
                let rankIds = [];
                if (Array.isArray(json)) {
                    rankIds = json;
                }

                const articlePromises = rankIds.map((id) =>
                    fetch(`http://localhost:8000/article-service/news/${id}`).then((res) => res.json())
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
            <TitleSection>
                <h2>실시간 인기 뉴스</h2>
                <Subtitle>지금 가장 많은 관심을 받고 있는 뉴스입니다</Subtitle>
            </TitleSection>
            <CardGrid>
                {rankedArticles.map((article, idx) => (
                    <CardContainer key={article.id} onClick={() => navigate(`/articles/${article.id}`)}>
                        <NewsCard news={article} rank={idx}/>
                    </CardContainer>
                ))}
            </CardGrid>
        </Wrapper>
    );
}

export default PopularNews;

const Wrapper = styled.div`
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    width: 100%;
    margin: 0 auto;
    max-width: 1600px;
    min-height: 800px;
    box-sizing: border-box;
    
    @media (max-width: 768px) {
        padding: 2rem 1rem;
    }
`;

const TitleSection = styled.div`
    text-align: center;
    margin-bottom: 2.5rem;
    
    h2 {
        font-size: 2rem;
        font-weight: 700;
        color: #0F1A25;
        margin-bottom: 0.5rem;
        
        @media (max-width: 768px) {
            font-size: 1.5rem;
        }
    }
`;

const Subtitle = styled.p`
    font-size: 1rem;
    color: #666;
    margin: 0;
    font-weight: 400;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
    padding: 0 2rem;
    box-sizing: border-box;

    @media (max-width: 1200px) {
        padding: 0;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.2rem;
    }

    @media (max-width: 900px) {
        padding: 0;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    @media (max-width: 600px) {
        padding: 0;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.8rem;
    }
`;

const CardContainer = styled.div`
    transition: transform 0.3s ease;
    border-radius: 20px;
    overflow: hidden;
    
    &:hover {
        transform: translateY(-4px);
    }
`;
