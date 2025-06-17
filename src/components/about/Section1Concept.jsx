import React, {forwardRef} from "react";
import styled from "styled-components";
import FileImage from "../../assets/3.png";
import SlideInTextBlock from "./SlideInTextBlock";

const Section1Concept = forwardRef((props, ref) => {
    return (
        <Section ref={ref}>
            <Wrapper>
                <h2>서비스 개념도</h2>
                <Image src={FileImage} alt="서비스 개념도"/>

                <SlideInTextBlock direction="left" delay="0s" positionStyle={{top: "18%", left: "-3%", zIndex: 2}}
                                  title="뉴스 데이터 수집" desc="네이버 뉴스 API 기반의 웹 크롤링을 통한 실시간 뉴스 데이터 수집 및 저장" align="left"/>
                <SlideInTextBlock direction="right" delay="0.3s" positionStyle={{top: "31%", right: "-9%", zIndex: 2}}
                                  title="의견 분류" desc="경찰과 시민 등 사용자 유형별로 의견 분류" align="right"/>
                <SlideInTextBlock direction="left" delay="0.6s" positionStyle={{top: "39%", left: "-8%", zIndex: 2}}
                                  title="사용자 의견 분석" desc="OpenAI 기반 의견 분석을 통해 의견의 긍정 / 부정 / 중립 판단" align="left"/>
                <SlideInTextBlock direction="right" delay="0.9s" positionStyle={{top: "51%", right: "-1.5%", zIndex: 2}}
                                  title="시각화 대시보드" desc="의견 분석 결과를 도넛 차트 등으로 시각화하여 인사이트 제공" align="right"/>
                <SlideInTextBlock direction="left" delay="1.2s" positionStyle={{top: "60%", left: "3.5%", zIndex: 2}}
                                  title="의견 통계 저장" desc="분석된 의견 분류 결과와 사용자 유형 데이터를 DB에 저장하여 추후 이슈 분석 및 트렌드 파악에 활용"
                                  align="left"/>
                <SlideInTextBlock direction="right" delay="1.5s" positionStyle={{top: "72%", right: "3%", zIndex: 2}}
                                  title="관리자 인사이트 제공" desc="저장된 의견 분류 통계를 기반으로 특정 사건·이슈에 대한 사회적 반응을 실시간 확인 및 대응"
                                  align="right"/>
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