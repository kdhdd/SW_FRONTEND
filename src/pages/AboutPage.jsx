import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import FileImage from "../assets/3.png";
import SlideInBox from "../components/SlideInBox.jsx";
import Footer from "../components/common/Footer.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function AboutPage() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);

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
            <FirstSection ref={section1Ref}>
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
            </FirstSection>

            <Arrow>↓</Arrow>

            <SecondSection ref={section2Ref} style={{backgroundColor: "white"}}>
                <FeatureWrapper>
                    <FeatureTitle>서비스 특징</FeatureTitle>
                    <FeatureCards>
                        <FeatureCard>
                            <FeatureIcon src="/icons/data-icon.svg" alt="정형화된 데이터"/>
                            <FeatureHeading>정형화된 데이터</FeatureHeading>
                            <FeatureText>
                                비정형 텍스트를 분석이 가능한 정형화된 데이터로 바꾸어,<br/>
                                사회현상을 분석할 수 있는 기초 자료 제공
                            </FeatureText>
                        </FeatureCard>
                        <FeatureCard>
                            <FeatureIcon src="/icons/bigdata-icon.svg" alt="빅데이터화"/>
                            <FeatureHeading>빅데이터화</FeatureHeading>
                            <FeatureText>
                                1990년부터 현재까지 104개 매체의 약 1억여건 뉴스 콘텐츠<br/>
                                빅데이터화
                            </FeatureText>
                        </FeatureCard>
                        <FeatureCard>
                            <FeatureIcon src="/icons/info-icon.svg" alt="가치 있는 정보"/>
                            <FeatureHeading>가치 있는 정보</FeatureHeading>
                            <FeatureText>
                                한번 읽고 버려지는 하루살이 정보인 뉴스 콘텐츠를 축적해<br/>
                                분석할 수 있는 정보로
                            </FeatureText>
                        </FeatureCard>
                    </FeatureCards>
                </FeatureWrapper>
            </SecondSection>


            <Footer/>
        </Container>
    );
}

export default AboutPage;

const Container = styled.div`
    width: 100%;
    padding-top: 10px;
`;

const FirstSection = styled.section`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h2 {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 50px;
    }
`;

const SecondSection = styled.section`
    padding: 100px 0;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: white;
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

const FeatureTitle = styled.h2`
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 3rem;
    text-align: center;
`;

const FeatureCards = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    max-width: 1200px;
    width: 100%;
    padding: 0 20px;
`;

const FeatureCard = styled.div`
    background-color: white;
    color: black;
    border-radius: 16px;
    padding: 2rem;
    flex: 1;
    min-width: 260px;
    max-width: 320px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const FeatureIcon = styled.img`
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
`;

const FeatureHeading = styled.h3`
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
`;

const FeatureText = styled.p`
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
`;
const FeatureWrapper = styled.div`
    width: 100%;
    background-color: #4256f4;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    min-height: 650px;
`;
