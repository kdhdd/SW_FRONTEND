import React, {useState, useEffect} from "react";
import styled, {keyframes} from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import NewsCard from "../components/common/NewsCard.jsx";
import Footer from "../components/common/Footer.jsx";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

function ArticlesPage() {
    const [newsData, setNewsData] = useState([]);
    const navigate = useNavigate();
    const {page} = useParams();

    const [currentPage, setCurrentPage] = useState(Math.max(parseInt(page || "1", 10), 1));
    const itemsPerPage = 12;
    const categories = ["마약", "성폭행", "사기", "살인", "방화", "폭행"];
    const [selectedCategory, setSelectedCategory] = useState("마약");
    const [articleCount, setArticleCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            try {
                const url = `http://localhost:8000/article-service/news?keyword=${selectedCategory}`;
                const res = await fetch(url);
                const json = await res.json();
                const data = Array.isArray(json.data) ? json.data : [];
                const sorted = data.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                setNewsData(sorted);
            } catch (err) {
                console.error("뉴스 불러오기 실패:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCount = async () => {
            try {
                const countRes = await fetch(`http://localhost:8000/article-service/news/count?keyword=${selectedCategory}`);
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
                <BackgroundGradient />
                <ContentContainer>
                    <Header>
                        <TitleSection>
                            <ArticleCount>
                                총 <span className="count">{articleCount}</span>건의 기사
                            </ArticleCount>
                        </TitleSection>
                    </Header>

                    <CategoryBar>
                        {categories.map((cat, index) => (
                            <CategoryButton
                                key={cat}
                                $active={selectedCategory === cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setPageGroupStart(1);
                                    handlePageChange(1);
                                }}
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                {cat}
                            </CategoryButton>
                        ))}
                    </CategoryBar>

                    {isLoading ? (
                        <LoadingContainer>
                            <LoadingSpinner />
                            <LoadingText>뉴스를 불러오는 중...</LoadingText>
                        </LoadingContainer>
                    ) : (
                        <Grid>
                            {currentNews.map((news, index) => (
                                <CardWrapper 
                                    key={news.id} 
                                    onClick={() => handleClickCard(news.id)}
                                    style={{animationDelay: `${index * 0.1}s`}}
                                >
                                    <NewsCard news={news}/>
                                </CardWrapper>
                            ))}
                        </Grid>
                    )}

                    {!isLoading && totalPages > 1 && (
                        <Pagination>
                            {pageGroupStart > 1 && (
                                <PaginationButton onClick={handlePrevGroup}>
                                    <span>‹</span>
                                </PaginationButton>
                            )}

                            {pageNumbers.map((page) => (
                                <PaginationButton
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={currentPage === page ? "active" : ""}
                                >
                                    {page}
                                </PaginationButton>
                            ))}

                            {pageGroupStart + pageGroupSize - 1 < totalPages && (
                                <PaginationButton onClick={handleNextGroup}>
                                    <span>›</span>
                                </PaginationButton>
                            )}
                        </Pagination>
                    )}
                </ContentContainer>
            </PageWrapper>
            <Footer/>
        </>
    );
}

export default ArticlesPage;

const PageWrapper = styled.div`
    position: relative;
    min-height: 100vh;
    height: 100vh;
    background: #fff;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
`;

const BackgroundGradient = styled.div`
    display: flex;
    flex-direction: column;
`;

const ContentContainer = styled.div`
    position: relative;
    z-index: 1;
    padding: 90px 0 40px 0;
    width: 100%;
    max-width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 900px) {
        padding: 70px 0 24px 0;
    }
    @media (max-width: 600px) {
        padding: 60px 0 12px 0;
    }
    @media (max-width: 390px) {
        padding: 55px 0 10px 0;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    animation: ${fadeInUp} 0.8s ease-out;
    flex-shrink: 0;
    padding: 0 10px;
    box-sizing: border-box;
    @media (max-width: 600px) {
        margin-bottom: 1.2rem;
        margin-top: 1rem;
        padding: 0 6px;
    }
    @media (max-width: 390px) {
        margin-bottom: 1rem;
        margin-top: 1rem;
        padding: 0 4px;
    }
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
`;

const MainTitle = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    color: #222;
    margin: 0;
    letter-spacing: -1px;
    position: relative;
    display: inline-block;
    padding-bottom: 0.4rem;
    &::after {
        content: '';
        display: block;
        width: 48px;
        height: 4px;
        background: #23406e; /* deep blue underline */
        border-radius: 2px;
        margin: 0.5rem auto 0 auto;
    }
    @media (max-width: 900px) {
        font-size: 2rem;
    }
    @media (max-width: 600px) {
        font-size: 1.4rem;
        &::after { width: 32px; height: 3px; }
    }
`;

const Subtitle = styled.p`
    font-size: 1.2rem;
    color: #444;
    margin-top: 1rem;
    font-weight: 400;
    letter-spacing: 0.01em;
    @media (max-width: 900px) {
        font-size: 1rem;
    }
    @media (max-width: 600px) {
        font-size: 0.95rem;
    }
`;

const ArticleCount = styled.div`
    font-size: 1rem;
    color: #444;
    background: #f5f6fa;
    padding: 8px 20px;
    border-radius: 25px;
    border: 1px solid #e3e6ee;
    margin: 1rem 0 0.1rem 0;
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: nowrap;
    .count {
        font-weight: 700;
        color: #23406e;
        font-size: 1.1rem;
    }
    @media (max-width: 600px) {
        font-size: 0.95rem;
        padding: 6px 14px;
    }
    @media (max-width: 390px) {
        font-size: 0.9rem;
        padding: 5px 12px;
        margin: 0.8rem 0 0.1rem 0;
    }
`;

const CategoryBar = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px 8px;
    margin-bottom: 2rem;
    animation: ${slideIn} 0.6s ease-out;
    flex-shrink: 0;
    padding: 0 10px;
    box-sizing: border-box;
    @media (max-width: 600px) {
        gap: 8px 4px;
        margin-bottom: 1.2rem;
        padding: 0 6px;
    }
    @media (max-width: 390px) {
        gap: 6px 2px;
        margin-bottom: 1rem;
        padding: 0 4px;
    }
`;

const CategoryButton = styled.button`
    padding: 10px 18px;
    border-radius: 50px;
    border: 1.5px solid ${({$active}) => $active ? '#23406e' : '#e0e0e0'};
    background: ${({$active}) => $active ? '#23406e' : '#f5f6fa'};
    color: ${({$active}) => ($active ? 'white' : '#222')};
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({$active}) => $active ? '0 2px 12px rgba(35,64,110,0.10)' : 'none'};
    animation: ${fadeInUp} 0.6s ease-out both;
    &:hover {
        background: ${({$active}) => $active ? '#1a2e4f' : '#e3e6ee'};
        color: #222;
    }
    &:active {
        transform: translateY(0);
    }
    @media (max-width: 900px) {
        font-size: 0.9rem;
        padding: 8px 12px;
    }
    @media (max-width: 600px) {
        font-size: 0.85rem;
        padding: 7px 0;
        flex: 1 1 calc(50% - 8px);
        max-width: calc(50% - 8px);
        text-align: center;
    }
    @media (max-width: 390px) {
        font-size: 0.8rem;
        padding: 6px 0;
        flex: 1 1 calc(50% - 4px);
        max-width: calc(50% - 4px);
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    gap: 1rem;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.p`
    color: #555;
    font-size: 1rem;
    margin: 0;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
    flex: 1;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 2vw;
    @media (min-width: 1400px) {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2.5rem;
        padding: 0 48px;
    }
    @media (max-width: 1399px) and (min-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        padding: 0 32px;
    }
    @media (max-width: 1199px) and (min-width: 900px) {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.8rem;
        padding: 0 24px;
    }
    @media (max-width: 899px) and (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.2rem;
        padding: 0 10px;
    }
    @media (max-width: 599px) {
        grid-template-columns: 1fr 1fr;
        gap: 0.8rem;
        padding: 0 6px;
    }
    @media (max-width: 390px) {
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
        padding: 0 4px;
    }
`;

const CardWrapper = styled.div`
    animation: ${fadeInUp} 0.6s ease-out both;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s;
    cursor: pointer;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(35,64,110,0.07);
    background: #fff;
    border: 1.5px solid #e3e6ee;
    overflow: hidden;
    &:hover {
        transform: translateY(-8px) scale(1.025);
        box-shadow: 0 6px 24px rgba(35,64,110,0.13);
        border-color: #23406e;
    }
    @media (max-width: 900px) {
        border-radius: 14px;
    }
    @media (max-width: 600px) {
        border-radius: 10px;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2rem;
    animation: ${fadeInUp} 0.8s ease-out;
`;

const PaginationButton = styled.button`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    color: #222;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background: #e0e0e0;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.07);
    }
    &.active {
        background: #222;
        color: white;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(34,34,34,0.12);
        animation: ${pulse} 2s infinite;
    }
    &:active {
        transform: translateY(0);
    }
    span {
        font-size: 1.2rem;
        font-weight: 700;
    }
`;

// Card 내부 정보(날짜, 좋아요, 댓글 등) 꾸미기
const CardInfoBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f6fa;
    color: #444;
    font-size: 0.97rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e3e6ee;
    letter-spacing: 0.01em;
`;

const CardMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 1.1rem;
    font-size: 0.97rem;
    color: #888;
    svg { margin-right: 0.2em; }
`;