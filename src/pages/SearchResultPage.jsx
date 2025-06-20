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
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentNews = newsData.slice(start, start + itemsPerPage);

    const [pageGroupStart, setPageGroupStart] = useState(1);
    const [pageGroupSize, setPageGroupSize] = useState(10); // 기본 10

    const handleNextGroup = () => {
        const nextStart = pageGroupStart + pageGroupSize;
        if (nextStart <= totalPages) {
            setPageGroupStart(nextStart);
            setCurrentPage(nextStart);
        }
    };

    const handlePrevGroup = () => {
        const prevStart = pageGroupStart - pageGroupSize;
        if (prevStart > 0) {
            setPageGroupStart(prevStart);
            setCurrentPage(prevStart);
        }
    };

    const pageNumbers = Array.from(
        {length: Math.min(pageGroupSize, totalPages - pageGroupStart + 1)},
        (_, i) => pageGroupStart + i
    );

    useEffect(() => {
        const handleResize = () => {
            setPageGroupSize(window.innerWidth <= 768 ? 5 : 10);
        };

        handleResize(); // 초기 설정
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!keyword) return;

        const fetchSearchResults = async () => {
            const url = date
                ? `https://crimearticle.net/article-service/news/search?keyword=${keyword}&date=${date}`
                : `https://crimearticle.net/article-service/news/search?keyword=${keyword}`;

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
                <div>
                    <Grid>
                        {currentNews.map((news) => (
                            <div key={news.id} onClick={() => handleClickCard(news.id)}>
                                <NewsCard news={news}/>
                            </div>
                        ))}
                    </Grid>
                    <Pagination>
                        {pageGroupStart > 1 && (
                            <button onClick={handlePrevGroup}>←</button>
                        )}

                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "active" : ""}
                            >
                                {page}
                            </button>
                        ))}

                        {pageGroupStart + pageGroupSize - 1 < totalPages && (
                            <button onClick={handleNextGroup}>→</button>
                        )}
                    </Pagination>
                </div>
            )}

        </PageWrapper>
    );
}

export default SearchResultPage;

const PageWrapper = styled.div`
    padding: 100px 40px 40px;
    background: white;
    min-height: 100vh;

    @media (max-width: 768px) {
        padding: 80px 20px 30px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    h2 {
        font-size: 1.4rem;

        @media (max-width: 768px) {
            font-size: 1.1rem;
            flex: 1 1 100%;
        }
    }
`;

const BackBtn = styled.button`
    background: white;
    border: 1px solid #ccc;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;

    @media (max-width: 768px) {
        font-size: 0.85rem;
        padding: 5px 10px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 20px;

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

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 30px;

    button {
        width: 38px;
        height: 38px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: white;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
            background: black;
            color: white;
            font-weight: bold;
        }
    }
`;
