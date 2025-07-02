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
                <TitleText>실시간 인기 뉴스</TitleText>
                <SubtitleText>지금 가장 많은 관심을 받고 있는 뉴스입니다</SubtitleText>
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
`;

const TitleBadge = styled.div`
    display: inline-block;
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 20px;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
    
    @media (max-width: 768px) {
        font-size: 0.7rem;
        padding: 5px 10px;
        margin-bottom: 10px;
    }
`;

const TitleText = styled.h2`
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #0F1A25 0%, #4A90E2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
        font-size: 1.6rem;
        margin: 0 0 6px 0;
    }
`;

const SubtitleText = styled.p`
    font-size: 1.1rem;
    color: #666;
    margin: 0;
    font-weight: 400;
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
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