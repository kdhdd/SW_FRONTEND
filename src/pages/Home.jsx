import React, {useEffect, useRef, useState} from "react";
import ScrollReveal from "scrollreveal";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import FileImage2 from "../assets/aboutBackground.png";
import {FaChartPie, FaRegNewspaper} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import PopularNews from "../components/common/PopularNews.jsx";
import Swal from "sweetalert2";
import SwalGlobalStyle from "../styles/SwalGlobalStyle";

function Home() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const searchNews = async (keyword, date) => {
        if (!keyword) {
            await Swal.fire({
                icon: 'warning',
                title: '검색어를 입력해주세요.',
                confirmButtonText: '확인',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-swal-button'
                }
            });

            return;
        }
        let query = `?keyword=${encodeURIComponent(keyword)}`;
        if (date) query += `&date=${date}`;
        navigate(`/search-result${query}`);
    };

    useEffect(() => {
        const elements = document.querySelectorAll(".reveal-title");
        elements.forEach((el, i) => {
            ScrollReveal().reveal(el, {
                delay: i * 300,
                origin: "top",
                distance: "40px",
                opacity: 0,
                duration: 700,
                interval: 600,
                easing: "ease-out",
                reset: true
            });
        });
    }, []);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrolling) return;
            const scrollY = window.scrollY;
            const section2Top = section2Ref.current.offsetTop;
            const direction = e.deltaY > 0 ? "down" : "up";
            if (scrollY < section2Top - 50 && direction === "down") {
                setIsScrolling(true);
                section2Ref.current.scrollIntoView({behavior: "smooth"});
            } else if (scrollY < section2Top && direction === "up") {
                setIsScrolling(true);
                section1Ref.current.scrollIntoView({behavior: "smooth"});
            }
            setTimeout(() => setIsScrolling(false), 800);
        };
        window.addEventListener("wheel", handleWheel, {passive: true});
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isScrolling]);

    return (
        <>
            <SwalGlobalStyle/>
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
                <NewsSection ref={section2Ref}>
                    <PopularNews/>
                </NewsSection>
            </Container>
        </>
    );
}

export default Home;

const Container = styled.div`
    width: 100%;
    padding-top: 10px;
    overflow-x: hidden;
`;

const HomeSection = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem;
    text-align: center;

    h1 {
        font-size: clamp(1.8rem, 4vw, 3rem);
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
        padding: 0 1rem;
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
        margin-top: 2rem;
    }
`;

const LeftText = styled.div`
    margin-top: 50px;
    text-align: left;
    flex: 1;

    h1 {
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: bold;
    }
`;

const InfoBox = styled.div`
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
    margin-top: 20rem;
    flex-wrap: wrap;
    z-index: 1;
    opacity: 0.95;

    @media (max-width: 768px) {
        gap: 1.5rem;
        padding: 1.2rem;
    }
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 250px;
`;

const InfoText = styled.p`
    font-size: 0.95rem;
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
    width: 90%;
    max-width: 800px;
    background: #ffffff;
    border-radius: 999px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    z-index: 3;

    @media (max-width: 768px) {
        padding: 0.8rem;
        gap: 0.6rem;
        border-radius: 1rem;
        width: 95%;
    }
`;

const SearchInput = styled.input`
    flex: 2;
    border: none;
    padding: 1rem 1.2rem;
    font-size: 1rem;
    outline: none;
    background: transparent;
    min-width: 0;
`;

const DateInput = styled.input`
    width: 160px;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    text-align: center;
    background-color: transparent;
    outline: none;
    min-width: 0;
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
        width: 100%;
        height: 45px;
        font-size: 1rem;
        border-radius: 0.5rem;
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