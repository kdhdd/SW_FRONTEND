import React, {useState, useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import styled from "styled-components";
import NewsCard from "../components/common/NewsCard.jsx";

function SearchResultPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const keyword = searchParams.get("keyword");
    const date = searchParams.get("date");
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        if (!keyword) return;

        const fetchSearchResults = async () => {
            const url = date
                ? `http://localhost:8000/article-service/news/search?keyword=${keyword}&date=${date}`
                : `http://localhost:8000/article-service/news/search?keyword=${keyword}`;

            try {
                const res = await fetch(url);
                const data = await res.json();
                setNewsData(data.data);
            } catch (err) {
                console.error("검색 결과 불러오기 실패:", err);
            }
        };

        fetchSearchResults();
    }, [keyword, date]);

    const handleClickCard = (id) => navigate(`/articles/${id}`);

    return (
        <PageWrapper>
            <Header>
                <h2>🔍 검색 결과: “{keyword}” {date ? `(${date})` : "(전체 기간)"}</h2>
                <BackBtn onClick={() => navigate("/articles/page/1")}>← 전체 뉴스 보기</BackBtn>
            </Header>

            {newsData.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                <Grid>
                    {newsData.map((news) => (
                        <div key={news.id} onClick={() => handleClickCard(news.id)}>
                            <NewsCard news={news}/>
                        </div>
                    ))}
                </Grid>
            )}
        </PageWrapper>
    );
}

export default SearchResultPage;

const PageWrapper = styled.div`
    padding: 100px 40px 40px;
    background: #f7f7f7;
    min-height: 100vh;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BackBtn = styled.button`
    background: white;
    border: 1px solid #ccc;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 20px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;
