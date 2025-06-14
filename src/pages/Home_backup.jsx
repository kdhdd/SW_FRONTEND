/*
import {useEffect, useState} from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";
import homeVideo from "/src/assets/background01.mp4";
import PopularNews from "../components/common/PopularNews.jsx";
import {useNavigate} from "react-router-dom";

function Home() {
    const [keyword, setKeyword] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const searchNews = async (keyword, date) => {
        if (!keyword) {
            alert("검색어를 입력해주세요.");
            return;
        }

        let query = `?keyword=${encodeURIComponent(keyword)}`;
        if (date) query += `&date=${date}`;

        navigate(`/search-result${query}`);

    };

    useEffect(() => {
        ScrollReveal().reveal(".text", {delay: 200, origin: "top"});
        ScrollReveal().reveal(".form-container", {delay: 400, origin: "left"});
        ScrollReveal().reveal(".reveal-title", {
            distance: "20px",
            origin: "top",
            opacity: 0,
            duration: 600,
            interval: 200,
            easing: "ease-out",
            reset: false,
        });
    }, []);


    return (
        <HomeSection id="home">
            <BgVideo autoPlay muted loop playsInline>
                <source src={homeVideo} type="video/mp4"/>
                <img src="/src/assets/main.png" alt=""/>
            </BgVideo>

            <IntroText>
                <h2 className="reveal-title">오늘의 뉴스</h2>
                <h1 className="reveal-title">실시간 기사와 인기 순위,</h1>
                <h1 className="reveal-title">경찰과 시민이 나눈 생생한 의견까지 한자리에</h1>
            </IntroText>

            <SearchBar>
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchNews(keyword, date);
                            }
                        }}
                    />
                    <button onClick={() => searchNews(keyword, date)}>🔍</button>
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </SearchBar>

            <PopularNews/>
        </HomeSection>
    );
}

export default Home;

const HomeSection = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: grid;
    align-items: start;
    grid-template-columns: 1fr 1fr 0.8fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const BgVideo = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
`;

const IntroText = styled.div`
    position: absolute;
    top: 10rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 2;
    padding: 1rem 2rem;

    h1, h2 {
        color: white;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    }

    h1 {
        font-size: 1.8rem;
    }

    h2 {
        color: #00BFFF;
        font-size: 5rem;
        font-weight: 850;
    }

    @media (max-width: 768px) {
        top: 6rem;
        width: 90%;
    }
`;


const SearchBar = styled.div`
    position: absolute;
    bottom: 19rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    max-width: 1000px;
    display: flex;
    gap: 1rem;
    align-items: center;
    z-index: 3;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .search-input-group {
        position: relative;
        flex: 1;

        input[type="text"] {
            width: 100%;
            padding: 0.75rem 3rem 0.75rem 1rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            font-size: 1rem;
        }

        button {
            position: absolute;
            top: 50%;
            right: 0.75rem;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            font-size: 1.2rem;
            color: #4a6cf7;
            cursor: pointer;
        }
    }

    input[type="date"] {
        padding: 0.75rem 1rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        flex-direction: column;

        .search-input-group,
        input[type="date"] {
            width: 100%;
        }
    }
`;
*/