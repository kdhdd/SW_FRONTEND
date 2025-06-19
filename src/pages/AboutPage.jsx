import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import Section1Concept from "../components/about/Section1Concept";
import Section2Feature from "../components/about/Section2Feature";
import Footer from "../components/common/Footer";

function AboutPage() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isSection2Visible, setIsSection2Visible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSection2Visible(entry.isIntersecting),
            {threshold: 0.1}
        );

        if (section2Ref.current) observer.observe(section2Ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Container>
            <Section1Concept ref={section1Ref}/>
            <Arrow>↓</Arrow>
            <Section2Feature ref={section2Ref} visible={isSection2Visible}/>
            <Footer/>
        </Container>
    );
}

export default AboutPage;

const Container = styled.div`
    width: 100%;
    padding-top: 30px;

    @media (max-width: 480px) {
        padding-top: 20px;
    }
`;

const Arrow = styled.div`
    font-size: clamp(2rem, 6vw, 4rem); // ✅ 반응형 폰트 크기
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
