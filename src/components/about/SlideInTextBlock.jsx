import React from "react";
import styled from "styled-components";
import SlideInBox from "./SlideInBox.jsx";

function SlideInTextBlock({direction, delay, positionStyle, title, desc, align = "left"}) {
    return (
        <SlideInBox direction={direction} delay={delay} style={positionStyle}>
            <TextBlock $align={align}>
                <h3>{title}</h3>
                <p>{desc}</p>
            </TextBlock>
        </SlideInBox>
    );
}

export default SlideInTextBlock;

const TextBlock = styled.div`
    text-align: ${({$align}) => $align};
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;