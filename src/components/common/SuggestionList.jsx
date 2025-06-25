import React, {useEffect, useRef} from "react";
import styled from "styled-components";

const SuggestionList = React.forwardRef(({suggestions, onSelect, highlightIndex}, ref) => {
    const itemRefs = useRef([]);

    useEffect(() => {
        if (
            highlightIndex >= 0 &&
            itemRefs.current[highlightIndex]
        ) {
            itemRefs.current[highlightIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [highlightIndex]);

    if (!suggestions.length) return null;

    return (
        <List ref={ref}>
            {suggestions.map((word, i) => (
                <Item
                    key={i}
                    ref={(el) => (itemRefs.current[i] = el)}
                    onClick={() => onSelect(word)}
                    style={{
                        backgroundColor: i === highlightIndex ? "#f0f0f0" : "white",
                        fontWeight: i === highlightIndex ? "bold" : "normal"
                    }}
                >
                    {word}
                </Item>
            ))}
        </List>
    );
});
export default SuggestionList;

const List = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 300px;
    background: white;
    border-radius: 0 0 1rem 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    text-align: left;

    @media (max-width: 768px) {
        width: 100%;
        left: 0;
        right: 0;
        border-radius: 0.5rem;
        max-height: 160px;
        font-size: 0.95rem;
        transform: translateY(4px); /* 살짝 아래로 */
    }
`;

const Item = styled.li`
    padding: 0.8rem 1rem;
    cursor: pointer;

    &:hover {
        background: #f0f0f0;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.7rem 1rem;
    }
`;
