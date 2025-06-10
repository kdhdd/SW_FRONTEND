import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import FileImage from "../assets/3.png";
import FileImage2 from "../assets/aboutBackground.png";
import {FaChartPie, FaRegNewspaper} from "react-icons/fa";

import SlideInBox from "../components/SlideInBox.jsx";
import Footer from "../components/common/Footer.jsx";

function AboutPage() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrolling) return; // 스크롤 중이면 무시
            setIsScrolling(true);

            const direction = e.deltaY > 0 ? "down" : "up";

            if (direction === "down") {
                section2Ref.current.scrollIntoView({behavior: "smooth"});
            } else {
                section1Ref.current.scrollIntoView({behavior: "smooth"});
            }

            // debounce: 일정 시간 뒤 다시 스크롤 허용
            setTimeout(() => {
                setIsScrolling(false);
            }, 800); // 애니메이션 지속 시간 고려
        };

        window.addEventListener("wheel", handleWheel, {passive: true});
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isScrolling]);

    return (
        <Container>
            <Section ref={section1Ref}>
                <ContentWrapperFlex>
                    <LeftText>
                        <h1>사용자 별 댓글 분석 서비스</h1>
                        <h1>오늘의 뉴스</h1>
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
                </ContentWrapperFlex>
            </Section>

            <Arrow>↓</Arrow>

            <Section ref={section2Ref}>
                <DiagramWrapper>
                    <h2>서비스 개념도</h2>
                    <Image src={FileImage} alt="서비스 개념도"/>

                    <SlideInBox direction="left" delay="0s" style={{top: "18%", left: "-3%", zIndex: 2}}>
                        <TextBlockLeft>
                            <h3>뉴스 기사 수집</h3>
                            <p>"마약", "살인", "폭행" 등 범죄 키워드를 포함한 뉴스 기사 자동 수집</p>
                        </TextBlockLeft>
                    </SlideInBox>
                    <SlideInBox direction="right" delay="0.3s" style={{top: "31%", right: "-9%", zIndex: 2}}>
                        <TextBlockRight>
                            <h3>댓글 분류</h3>
                            <p>경찰과 시민 등 사용자 유형별로 댓글 분류</p>
                        </TextBlockRight>
                    </SlideInBox>
                    <SlideInBox direction="left" delay="0.6s" style={{top: "39%", left: "-8%", zIndex: 2}}>
                        <TextBlockLeft>
                            <h3>댓글 분석</h3>
                            <p>OpenAI 기반 감정 분석을 통해 댓글의 긍정 / 부정 / 중립 판단</p>
                        </TextBlockLeft>
                    </SlideInBox>
                    <SlideInBox direction="right" delay="0.9s" style={{top: "51%", right: "-1.5%", zIndex: 2}}>
                        <TextBlockRight>
                            <h3>시각화 대시보드</h3>
                            <p>감정 분석 결과를 도넛 차트 등으로 시각화하여 인사이트 제공</p>
                        </TextBlockRight>
                    </SlideInBox>
                    <SlideInBox direction="left" delay="1.2s" style={{top: "60%", left: "3.5%", zIndex: 2}}>
                        <TextBlockLeft>
                            <h3>댓글 통계 저장</h3>
                            <p>분석된 댓글 감정 결과와 사용자 유형 데이터를 데이터베이스에 저장하여 추후 이슈 분석 및 트렌드 파악에 활용</p>
                        </TextBlockLeft>
                    </SlideInBox>
                    <SlideInBox direction="right" delay="1.5s" style={{top: "72%", right: "3%", zIndex: 2}}>
                        <TextBlockRight>
                            <h3>관리자 인사이트 제공</h3>
                            <p>저장된 감정 통계를 기반으로 특정 사건·이슈에 대한 사회적 반응을 실시간 확인 및 대응</p>
                        </TextBlockRight>
                    </SlideInBox>
                </DiagramWrapper>
            </Section>
            <Footer/>
        </Container>
    );
}

export default AboutPage;

const Container = styled.div`
    width: 100%;
    padding-top: 150px;
`;

const Section = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;

    h2 {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 50px;
    }
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
    filter: blur(0.4px);
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
    margin-top: -50px;
    text-align: left;

    h1 {
        font-size: 3rem;
        font-weight: bold;
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
    margin-top: 17rem;
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

const DiagramWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    height: 700px;
    overflow: visible;
`;

const Image = styled.img`
    width: 100%;
    z-index: 1;
    position: relative;
`;

const TextBlockLeft = styled.div`
    text-align: left;
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TextBlockRight = styled(TextBlockLeft)`
    text-align: right;
`;
