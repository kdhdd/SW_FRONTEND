import React, {useEffect, useRef, useState} from "react";
import styled, {css, keyframes} from "styled-components";

function SlideInBox({children, direction = "left", delay = "0s", style}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {threshold: 0.05}
        );

        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <Box
            ref={ref}
            $isVisible={isVisible}
            $direction={direction}
            $delay={delay}
            style={style}
        >
            {children}
        </Box>
    );
}

export default SlideInBox;

const slideInLeft = keyframes`
    from {
        transform: translateX(-30px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideInRight = keyframes`
    from {
        transform: translateX(30px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const Box = styled.div`
    position: absolute;
    max-width: 300px;
    z-index: 5;
    opacity: 0;

    ${({$isVisible, $direction, $delay}) =>
            $isVisible &&
            css`
                animation: ${$direction === "left" ? slideInLeft : slideInRight} 0.8s ease forwards;
                animation-delay: ${$delay};
            `}
`;
