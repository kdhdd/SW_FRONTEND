import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import NewsCard from "../components/common/NewsCard.jsx";
import Footer from "../components/common/Footer.jsx";

function ArticlesPage() {
    const [newsData, setNewsData] = useState([]);
    const navigate = useNavigate();
    const {page} = useParams();

    const [currentPage, setCurrentPage] = useState(Math.max(parseInt(page || "1", 10), 1));
    const itemsPerPage = 12;
    const categories = ["마약", "성폭행", "사기", "살인", "방화", "폭행"];
    const [selectedCategory, setSelectedCategory] = useState("마약");
    const [articleCount, setArticleCount] = useState(0);

    const [pageGroupStart, setPageGroupStart] = useState(1);
    const [pageGroupSize, setPageGroupSize] = useState(10);

    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentNews = newsData.slice(start, start + itemsPerPage);

    useEffect(() => {
        setCurrentPage(Math.max(parseInt(page || "1", 10), 1));
    }, [page]);

    useEffect(() => {
        const handleResize = () => {
            setPageGroupSize(window.innerWidth <= 768 ? 5 : 10);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const pageNumbers = Array.from(
        {length: Math.min(pageGroupSize, totalPages - pageGroupStart + 1)},
        (_, i) => pageGroupStart + i
    );

    const handleClickCard = (id) => navigate(`/articles/${id}`);
    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`/articles/page/${page}`);
    };
    const handleNextGroup = () => {
        const nextStart = pageGroupStart + pageGroupSize;
        if (nextStart <= totalPages) {
            setPageGroupStart(nextStart);
            handlePageChange(nextStart);
        }
    };
    const handlePrevGroup = () => {
        const prevStart = pageGroupStart - pageGroupSize;
        if (prevStart > 0) {
            setPageGroupStart(prevStart);
            handlePageChange(prevStart);
        }
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const url = `https://crimearticle.net/article-service/news?keyword=${selectedCategory}`;
                const res = await fetch(url);
                const json = await res.json();
                const data = Array.isArray(json.data) ? json.data : [];
                setNewsData(data);
            } catch (err) {
                console.error("뉴스 불러오기 실패:", err);
            }
        };

        const fetchCount = async () => {
            try {
                const countRes = await fetch(`https://crimearticle.net/article-service/news/count?keyword=${selectedCategory}`);
                const countData = await countRes.json();
                setArticleCount(countData.count);
            } catch (err) {
                console.error("카운트 불러오기 실패:", err);
            }
        };

        fetchNews();
        fetchCount();
    }, [selectedCategory]);

    return (
        <>
            <PageWrapper>
                <Header>
                    <h2>
                        오늘의 뉴스 <span style={{fontSize: "1rem", color: "#888"}}> (총 {articleCount}건)</span>
                    </h2>
                </Header>

                <CategoryBar>
                    {categories.map((cat) => (
                        <CategoryButton
                            key={cat}
                            $active={selectedCategory === cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setPageGroupStart(1); // 카테고리 변경 시 페이지 초기화
                                handlePageChange(1);
                            }}
                        >
                            {cat}
                        </CategoryButton>
                    ))}
                </CategoryBar>

                <Grid>
                    {currentNews.map((news) => (
                        <div key={news.id} onClick={() => handleClickCard(news.id)}>
                            <NewsCard news={news}/>
                        </div>
                    ))}
                </Grid>

                <Pagination>
                    {pageGroupStart > 1 && <button onClick={handlePrevGroup}>←</button>}

                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page}
                        </button>
                    ))}

                    {pageGroupStart + pageGroupSize - 1 < totalPages && <button onClick={handleNextGroup}>→</button>}
                </Pagination>
            </PageWrapper>
            <Footer/>
        </>
    );
}

export default ArticlesPage;

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
    gap: 0.5rem;

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: left;

        @media (max-width: 768px) {
            font-size: 1.3rem;
        }
    }
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

const CategoryBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 1rem 0 1.5rem;
`;

const CategoryButton = styled.button`
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background-color: ${({$active}) => ($active ? "#3c3b3b" : "#eee")};
    color: ${({$active}) => ($active ? "white" : "black")};
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #ddd;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 6px 12px;
    }
`;