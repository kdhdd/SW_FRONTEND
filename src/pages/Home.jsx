import React, {useEffect, useRef, useState, useCallback} from "react";
import ScrollReveal from "scrollreveal";
import styled, { keyframes } from "styled-components";
import {useNavigate} from "react-router-dom";
import FileImage2 from "../assets/aboutBackground.png";
import {FaChartPie, FaRegNewspaper, FaArrowDown} from "react-icons/fa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import PopularNews from "../components/common/PopularNews.jsx";
import Swal from "sweetalert2";
import SwalGlobalStyle from "../styles/SwalGlobalStyle";
import SuggestionList from "../components/common/SuggestionList";
import {extractKeywordsFromTitles} from "../utils/keywordHelper";

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

function Home() {
    const [keyword, setKeyword] = useState("");
    const [date, setDate] = useState("");
    const [allKeywords, setAllKeywords] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const inputRef = useRef(null);
    const suggestionRef = useRef(null);
    const navigate = useNavigate();

    const searchNews = useCallback(async (keyword, date) => {
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
    }, [navigate]);

    const updateSuggestions = useCallback((value) => {
        if (value.trim()) {
            const filtered = allKeywords
                .filter(word => word.startsWith(value))
                .slice(0, 10);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
        setHighlightIndex(-1);
    }, [allKeywords]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setKeyword(value);
        updateSuggestions(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" && suggestions.length > 0) {
            e.preventDefault();
            setHighlightIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp" && suggestions.length > 0) {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev === -1 ? suggestions.length - 1 : (prev - 1 + suggestions.length) % suggestions.length
            );
        } else if (e.key === "Enter") {
            if (highlightIndex >= 0 && suggestions.length > 0) {
                const selected = suggestions[highlightIndex];
                setKeyword(selected);
                setSuggestions([]);
                setHighlightIndex(-1);
                searchNews(selected, date);
            } else {
                searchNews(keyword, date);
            }
        } else if (e.key === "Escape") {
            setSuggestions([]);
            setHighlightIndex(-1);
        }
    };

    const handleSuggestionSelect = (word) => {
        setKeyword(word);
        setSuggestions([]);
        setHighlightIndex(-1);
        searchNews(word, date);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target) &&
                suggestionRef.current &&
                !suggestionRef.current.contains(e.target)
            ) {
                setSuggestions([]);
                setHighlightIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll(".reveal-title");
        elements.forEach((el, i) => {
            ScrollReveal().reveal(el, {
                delay: i * 200,
                origin: "top",
                distance: "30px",
                opacity: 0,
                duration: 800,
                interval: 400,
                easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                reset: true
            });
        });
    }, []);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const urls = [
                    "http://localhost:8000/article-service/news",
                    "http://localhost:8000/article-service/news?keyword=성폭행",
                    "http://localhost:8000/article-service/news?keyword=사기",
                    "http://localhost:8000/article-service/news?keyword=방화",
                    "http://localhost:8000/article-service/news?keyword=살인"
                ];

                const responses = await Promise.all(urls.map(url => fetch(url)));
                const allData = await Promise.all(responses.map(res => res.json()));

                const allTitles = allData.flatMap(data => data?.data?.map(article => article.title) || []);
                const uniqueTitles = [...new Set(allTitles)];
                const keywords = extractKeywordsFromTitles(uniqueTitles);
                setAllKeywords(keywords);

            } catch (err) {
                console.error("모든 뉴스 불러오기 실패", err);
            }
        };

        fetchKeywords();
    }, []);

    return (
        <>
            <SwalGlobalStyle/>
            <Container>
                <HomeSection>
                    <BackgroundGradient />
                    <ContentWrapperFlex>
                        <LeftText>
                            <TitleWrapper>
                                <h1 className="reveal-title">
                                    <GradientText>사건, 오늘</GradientText>
                                </h1>
                                <h2 className="reveal-title">지금 일어나는 범죄 뉴스를 한눈에</h2>
                                <h2 className="reveal-title">경찰과 시민의 목소리를 모두 담다</h2>
                            </TitleWrapper>
                        </LeftText>
                        <ImageBox>
                            <ImageWrapper>
                                <img src={FileImage2} alt="소개 이미지"/>
                            </ImageWrapper>
                        </ImageBox>
                        <InfoBox>
                            <InfoItem>
                                <IconWrapper>
                                    <FaChartPie size={32}/>
                                </IconWrapper>
                                <InfoText>
                                    범죄 키워드 기반의 데이터 추출과 AI 모델을 이용한<br/>
                                    분석으로 경찰과 시민의 관점을 분리 통계화합니다.
                                </InfoText>
                            </InfoItem>
                            <InfoItem>
                                <IconWrapper>
                                    <FaRegNewspaper size={32}/>
                                </IconWrapper>
                                <InfoText>
                                    실시간으로 수집되는 주요 뉴스 데이터를 분류하고 <br/>
                                    사용자 의견을 통해 사회적 반응을 시각적으로 제공합니다.
                                </InfoText>
                            </InfoItem>
                        </InfoBox>
                        <SearchBar>
                            <SearchInput
                                ref={inputRef}
                                type="text"
                                placeholder="검색어를 입력하세요"
                                value={keyword}
                                onChange={handleInputChange}
                                onFocus={() => updateSuggestions(keyword)}
                                onKeyDown={handleKeyDown}
                            />

                            <SuggestionList
                                ref={suggestionRef}
                                suggestions={suggestions}
                                onSelect={handleSuggestionSelect}
                                highlightIndex={highlightIndex}
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
                <ArrowWrapper>
                    <FaArrowDown size={24} />
                </ArrowWrapper>
                <NewsSection>
                    <PopularNews/>
                </NewsSection>
            </Container>
        </>
    );
}

export default Home;

const Container = styled.div`
    width: 100%;
    overflow-x: hidden;
    position: relative;
`;

const BackgroundGradient = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.05;
    z-index: -1;
`;

const HomeSection = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem;
    text-align: center;
    position: relative;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const NewsSection = styled.section`
    padding: 1.5rem 0 6rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
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
        gap: 20px;
        flex-direction: column;
        padding: 0 1rem;
    }
`;

const TitleWrapper = styled.div`
    animation: ${fadeInUp} 1s ease-out;
`;

const GradientText = styled.span`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 200% 200%;
    animation: ${gradientShift} 3s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const ImageBox = styled.div`
    position: absolute;
    margin-top: -100px;
    right: -70px;
    width: 100%;
    max-width: 900px;
    z-index: 0;
    animation: ${float} 6s ease-in-out infinite;

    @media (max-width: 768px) {
        position: relative;
        right: 0;
        margin-top: 0;
        max-width: 100%;
        padding: 0;
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    height: auto;
    border-radius: 20px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: auto;
        object-fit: cover;
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.02);
        }
    }
`;

const LeftText = styled.div`
    margin-top: 50px;
    text-align: left;
    flex: 1;
    z-index: 2;

    @media (max-width: 768px) {
        margin-top: 20px;
        line-height: 1.4;
        font-size: 1rem;
    }

    h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        margin-bottom: 1.5rem;
        letter-spacing: -0.02em;
    }

    h2 {
        margin: 1.2rem 0;
        font-size: clamp(1.1rem, 2.5vw, 1.4rem);
        font-weight: 500;
        color: #4a5568;
        line-height: 1.6;

        @media (max-width: 768px) {
            margin: 0.8rem 0;
            line-height: 1.4;
            font-size: 1rem;
        }
    }
`;

const InfoBox = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    max-width: 1200px;
    width: 100%;
    margin-top: 20rem;
    flex-wrap: wrap;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: ${fadeInUp} 1s ease-out 0.5s both;

    @media (max-width: 768px) {
        gap: 2rem;
        padding: 1.5rem;
        margin-top: 2rem;
    }
`;

const InfoItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    flex: 1;
    min-width: 280px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const IconWrapper = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    flex-shrink: 0;
`;

const InfoText = styled.p`
    font-size: 1rem;
    color: #2d3748;
    line-height: 1.7;
    text-align: left;
    font-weight: 400;
`;

const SearchBar = styled.div`
    position: absolute;
    bottom: 10rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 90%;
    max-width: 800px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 3;
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: ${fadeInUp} 1s ease-out 1s both;

    @media (max-width: 768px) {
        position: static;
        transform: none;
        margin: 2rem auto 0;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1.5rem;
        border-radius: 20px;
    }
`;

const SearchInput = styled.input`
    flex: 2;
    border: none;
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
    outline: none;
    background: transparent;
    min-width: 0;
    color: #2d3748;

    &::placeholder {
        color: #a0aec0;
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
    }
`;

const DateInput = styled.input`
    width: 160px;
    border: none;
    padding: 1.2rem 1rem;
    font-size: 1rem;
    text-align: center;
    background-color: transparent;
    outline: none;
    min-width: 0;
    color: #2d3748;

    @media (max-width: 768px) {
        width: 100%;
        padding: 1rem;
    }
`;

const SearchButton = styled.button`
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.2rem;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 50px;
        font-size: 1rem;
        border-radius: 12px;
    }
`;

const ArrowWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
    color: #667eea;
    animation: ${float} 2s ease-in-out infinite;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        margin: 1rem 0;
    }
`;