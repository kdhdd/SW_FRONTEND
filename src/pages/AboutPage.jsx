import React, {useRef, useState, useEffect} from "react";
import styled from "styled-components";
import Section1Concept from "../components/about/Section1Concept";
import Section2Feature from "../components/about/Section2Feature";
import Footer from "../components/common/Footer";

function AboutPage() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isSection2Visible, setIsSection2Visible] = useState(false);

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsSection2Visible(entry.isIntersecting),
            {threshold: 0.3}
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
    padding-top: 10px;
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