import React from "react";
import styled from "styled-components";

export default function ArticleContent({content}) {
    if (!content) return <p>내용이 없습니다.</p>;

    const cleaned = content
        .replace(/data-src=/g, "src=")
        .replace(/style="display:\s?none;?"/g, "");

    return <Content dangerouslySetInnerHTML={{__html: cleaned}}/>;
}

const Content = styled.div`
    margin-top: 20px;
    font-size: 1.05rem;
    line-height: 1.6;

    img {
        max-width: 100%;
        height: auto;
        margin: 12px 0;
        display: block;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
    }

    @media (max-width: 480px) {
        font-size: 0.95rem;
    }
`;