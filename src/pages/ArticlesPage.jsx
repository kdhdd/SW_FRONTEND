import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import NewsCard from "../components/common/NewsCard.jsx";
import Footer from '../components/common/Footer.jsx';

function ArticlesPage() {
    const [newsData, setNewsData] = useState([]);
    const navigate = useNavigate();
    const {page} = useParams();

    const currentPage = Math.max(parseInt(page || "1", 10), 1);
    const itemsPerPage = 12;
    const categories = ["마약", "성폭행", "사기", "살인", "방화", "폭행"];
    const [selectedCategory, setSelectedCategory] = useState("마약");
    const [articleCount, setArticleCount] = useState(0);

    // 선택된 키워드에 따라 뉴스 가져오기
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const url = `http://localhost:8000/article-service/news?keyword=${selectedCategory}`;
                const res = await fetch(url);
                const json = await res.json();
                const data = Array.isArray(json.data) ? json.data : []; // 안전하게 fallback
                setNewsData(data);
            } catch (err) {
                console.error("뉴스 불러오기 실패:", err);
            }
        };
        const fetchCount = async () => {
            try {
                const countRes = await fetch(`http://localhost:8000/article-service/news/count?keyword=${selectedCategory}`);
                const countData = await countRes.json();
                setArticleCount(countData.count); // ✅ 숫자만 넣기
            } catch (err) {
                console.error("카운트 불러오기 실패:", err);
            }
        };
        fetchNews();
        fetchCount();
    }, [selectedCategory]);


    const sortedNews = [...newsData].sort(
        (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
    );

    const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentNews = sortedNews.slice(start, start + itemsPerPage);

    const handleClickCard = (id) => navigate(`/articles/${id}`);

    return (
        <>
            <PageWrapper>
                <Header>
                    {/*<h2>오늘의 뉴스 <span style={{fontSize: '1rem', color: '#888'}}> (총 {articleCount}건)</span></h2>*/}
                </Header>
                <CategoryBar>
                    {categories.map(cat => (
                        <CategoryButton
                            key={cat}
                            $active={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
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
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(`/articles/page/${i + 1}`)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >
                            {i + 1}
                        </button>
                    ))}
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
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: left;
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
        grid-template-columns: 1fr;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;

    button {
        margin: 0 5px;
        padding: 8px 14px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;

        &.active {
            background: var(--main-color);
            color: white;
            font-weight: bold;
        }
    }
`;
const CategoryBar = styled.div`
    display: flex;
    gap: 10px;
    margin: 1rem 0 1.5rem;
`;

const CategoryButton = styled.button`
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background-color: ${({$active}) => ($active ? "#9ddbcf" : "#eee")};
    color: ${({$active}) => ($active ? "white" : "black")};
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #ddd;
    }
`;

