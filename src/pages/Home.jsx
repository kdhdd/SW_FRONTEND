import React, {useEffect, useRef, useState} from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import FileImage2 from "../assets/aboutBackground.png";
import {FaChartPie, FaRegNewspaper} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import PopularNews from "../components/common/PopularNews.jsx";

function Home() {

    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);

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
            distance: "40px",
            origin: "top",
            opacity: 0,
            duration: 700,
            interval: 600,
            easing: "ease-out",
            reset: false,
        });
    }, []);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrolling) return;

            const scrollY = window.scrollY;
            const section2Top = section2Ref.current.offsetTop;

            const direction = e.deltaY > 0 ? "down" : "up";

            // 👇 아래로 스크롤: section1 → section2
            if (scrollY < section2Top - 50 && direction === "down") {
                setIsScrolling(true);
                section2Ref.current.scrollIntoView({behavior: "smooth"});
            }
            // 👇 위로 스크롤: section2에서 위로 올리다 section1을 침범한 경우
            else if (scrollY < section2Top && direction === "up") {
                setIsScrolling(true);
                section1Ref.current.scrollIntoView({behavior: "smooth"});
            }

            setTimeout(() => setIsScrolling(false), 800);
        };

        window.addEventListener("wheel", handleWheel, {passive: true});
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isScrolling]);

    return (
        <Container>
            <HomeSection ref={section1Ref}>
                <ContentWrapperFlex>
                    <LeftText>
                        <h1 className="reveal-title">사용자 별 댓글 분석 서비스</h1>
                        <h1 className="reveal-title">오늘의 뉴스</h1>
                        <h2 className="reveal-title">실시간 기사와 인기 순위,</h2>
                        <h2 className="reveal-title">경찰과 시민이 나눈 생생한 의견까지 한자리에</h2>
                    </LeftText>
                    <ImageBox>
                        <img src={FileImage2} alt="소개 이미지"/>
                    </ImageBox>
                    <InfoBox>
                        <InfoItem>
                            <FaChartPie size={40}/>
                            <InfoText>
                                범죄 키워드 기반의 데이터 추출과 AI 모델을 이용한 분석으로 <br/>
                                경찰과 시민의 관점을 분리 통계화합니다.
                            </InfoText>
                        </InfoItem>
                        <InfoItem>
                            <FaRegNewspaper size={40}/>
                            <InfoText>
                                실시간으로 수집되는 주요 기사 데이터를 분류하고 <br/>
                                댓글을 통해 사회적 반응을 시각적으로 제공합니다.
                            </InfoText>
                        </InfoItem>
                    </InfoBox>

                    <SearchBar>
                        <SearchInput
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") searchNews(keyword, date);
                            }}
                        />
                        <DateInput
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <SearchButton onClick={() => searchNews(keyword, date)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </SearchButton>
                    </SearchBar>


                </ContentWrapperFlex>
            </HomeSection>

            <Arrow>↓</Arrow>

            <NewsSection
                ref={section2Ref}
            >
                <PopularNews/>
            </NewsSection>
        </Container>
    );
}

export default Home;

const Container = styled.div`
    width: 100%;
    padding-top: 10px;
`;

const HomeSection = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;

    h1 {
        font-size: 3rem;
        font-weight: bold;
    }
`;

const NewsSection = styled.section`
    padding: 1.5rem 0 6rem;
    background: #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentWrapperFlex = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ImageBox = styled.div`
    position: absolute;
    margin-top: -100px;
    right: -70px;
    width: 100%;
    max-width: 900px;
    z-index: 0;
    filter: blur(0.6px);
    opacity: 0.7;

    img {
        width: 100%;
        height: auto;
        object-fit: contain;
    }

    @media (max-width: 768px) {
        position: static;
        width: 100%;
        max-width: none;
        opacity: 1;
    }
`;

const LeftText = styled.div`
    margin-top: 50px;
    text-align: left;

    h1 {
        font-size: 3rem;
        font-weight: bold;
    }
`;

const InfoBox = styled.div`
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 100px;
    max-width: 1200px;
    width: 100%;
    margin-top: 22rem;
    flex-wrap: wrap;
    z-index: 1;
    opacity: 0.9;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 300px;
`;

const InfoText = styled.p`
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
`;

const SearchBar = styled.div`
    position: absolute;
    bottom: 10rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    width: 60%;
    max-width: 800px;
    background: #ffffff;
    border-radius: 999px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    z-index: 3;

    @media (max-width: 768px) {
        flex-direction: column;
        border-radius: 1rem;
        padding: 1rem;
        gap: 0.5rem;
    }
`;

const SearchInput = styled.input`
    flex: 2;
    border: none;
    padding: 1rem 1.2rem;
    font-size: 1rem;
    outline: none;
    background: transparent;
`;

const DateInput = styled.input`
    width: 160px;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    text-align: center;
    background-color: transparent;
    outline: none;
`;

const SearchButton = styled.button`
    width: 60px;
    height: 60px;
    background-color: #000;
    color: white;
    font-size: 1.2rem;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background-color: #333;
    }

    svg {
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        border-radius: 0.5rem;
        width: 100%;
    }
`;

const Arrow = styled.div`
    font-size: 4rem;
    color: #aaa;
    text-align: center;
    margin: -2rem 0 2rem;
    animation: bounce 2s infinite;
    font-weight: bold;

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(8px);
        }
    }
`;