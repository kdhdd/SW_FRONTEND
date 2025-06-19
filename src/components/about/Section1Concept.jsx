import React, {forwardRef} from "react";
import styled from "styled-components";
import FileImage from "../../assets/3.png";

const Section1Concept = forwardRef((props, ref) => {
    const SlideInTextBlock = ({title, desc, direction, delay, positionStyle}) => {
        return (
            <TextBlock style={positionStyle} direction={direction} delay={delay}>
                <Title>{title}</Title>
                <Description>{desc}</Description>
            </TextBlock>
        );
    };

    return (
        <Section ref={ref}>
            <Wrapper>
                <h2>서비스 개념도</h2>
                <Image src={FileImage} alt="서비스 개념도"/>

                <SlideInTextBlock direction="left" delay="0s" positionStyle={{top: "18%", left: "4%", zIndex: 2}}
                                  title="뉴스 데이터 수집" desc={<>실시간 범죄 유형별<br/>최신 뉴스 데이터를 빠르게 수집</>}
                />
                <SlideInTextBlock direction="right" delay="0.3s" positionStyle={{top: "28%", right: "2%", zIndex: 2}}
                                  title="키워드별 뉴스 필터링" desc={<>범죄 키워드로 관심 기사<br/>빠른 탐색ㆍ추적</>}
                />
                <SlideInTextBlock direction="left" delay="0.6s" positionStyle={{top: "39%", left: "3%", zIndex: 2}}
                                  title="뉴스 랭킹" desc={<>실시간 사용자 논쟁 뉴스를<br/>인기 순위별로 제공</>}
                />
                <SlideInTextBlock direction="right" delay="0.9s" positionStyle={{top: "51%", right: "3.5%", zIndex: 2}}
                                  title="사용자 의견 분석" desc={<>AI 기반 의견 분석으로<br/>긍정ㆍ부정ㆍ중립을 세밀하게 분석</>}
                />
                <SlideInTextBlock direction="left" delay="1.2s" positionStyle={{top: "60%", left: "9%", zIndex: 2}}
                                  title="분석 결과 분류 및 시각화"
                                  desc={<>경찰ㆍ시민 등 사용자 유형별<br/>관점을 분류해 차트로 시각화 제공</>}
                />
                <SlideInTextBlock direction="right" delay="1.5s" positionStyle={{top: "72%", right: "12%", zIndex: 2}}
                                  title="뉴스 이슈 캘린더"
                                  desc={<>주제별 뉴스량을 월ㆍ일 단위<br/>히트맵으로 한눈에 확인</>}
                />
            </Wrapper>
        </Section>
    );
});

export default Section1Concept;

const Section = styled.section`
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

const Wrapper = styled.div`
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

const TextBlock = styled.div`
    position: absolute;
    max-width: 260px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    animation: ${({delay}) => `slide-in 0.6s ${delay} ease-out both`};

    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(${({direction}) => (direction === "left" ? "-30px" : "30px")});
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

const Title = styled.h3`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
`;

const Description = styled.p`
    font-size: 0.95rem;
    line-height: 1.4;
    text-align: center;
`;