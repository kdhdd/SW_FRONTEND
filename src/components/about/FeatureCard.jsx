import React from "react";
import styled, {css, keyframes} from "styled-components";

const slideUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

function FeatureCard({title, children, visible, delay}) {
    return (
        <Card $visible={visible} $delay={delay}>
            <h3>{title}</h3>
            <p>{children}</p>
        </Card>
    );
}

export default FeatureCard;

const Card = styled.div`
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

    opacity: 0;
    transform: translateY(50px);

    ${({$visible, $delay}) =>
            $visible &&
            css`
                animation: ${slideUp} 0.9s ease-out forwards;
                animation-delay: ${$delay}s;
            `}
`;