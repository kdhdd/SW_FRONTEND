import React, {forwardRef} from "react";
import FeatureCard from "./FeatureCard";
import styled from "styled-components";

const Section2Feature = forwardRef(({visible}, ref) => {
    return (
        <Section ref={ref}>
            <Wrapper>
                <Title>서비스 특징</Title>
                <CardContainer>
                    <FeatureCard visible={visible} delay={0.2} title="정형화된 데이터">
                        작성된 사용자 의견을<br/>AI로 감정 분석하여<br/>분석 가능한 정형 데이터 제공
                    </FeatureCard>
                    <FeatureCard visible={visible} delay={0.4} title="빅데이터화">
                        실시간으로 수집된 뉴스 기사와<br/>사용자 의견 수를 기반으로<br/>랭킹 알고리즘이 작동되며<br/>범죄 관련 뉴스의 파급력과 관심도를<br/>숫자와 그래프로 시각화하는
                        데 활용
                    </FeatureCard>
                    <FeatureCard visible={visible} delay={0.6} title="가치 있는 정보">
                        흘러가는 뉴스가 아닌,<br/>사용자의 반응과 의견이 축적된<br/>뉴스 콘텐츠를 통해 사회적 이슈에<br/>대한 집단 반응을 분석할 수 있는<br/>가치 있는 공공
                        데이터로 전환
                    </FeatureCard>
                </CardContainer>
            </Wrapper>
        </Section>
    );
});

export default Section2Feature;

const Section = styled.section`
    padding: 100px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: white;
`;

const Wrapper = styled.div`
    width: 100%;
    background-color: #4256f4;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    min-height: 650px;

    @media (max-width: 768px) {
        padding: 2rem 1rem;
        min-height: auto;
    }
`;

const Title = styled.h2`
    font-size: clamp(1.8rem, 6vw, 2.8rem);
    font-weight: bold;
    margin-bottom: 3rem;
`;

const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    max-width: 1200px;
    width: 100%;
    padding: 0 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }
`;