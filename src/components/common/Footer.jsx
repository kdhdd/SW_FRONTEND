import React from "react";
import styled from "styled-components";

function Footer() {
    return (
        <FooterWrapper>
            <TextSection>
                <Address>서울특별시 성북구 서경로 124</Address>
                <Copy>COPYRIGHT© 2025 ALJALDDAGGALSAEN. ALL RIGHTS RESERVED.</Copy>
            </TextSection>
        </FooterWrapper>
    );
}

export default Footer;

/* ────────── styled-components ────────── */

const FooterWrapper = styled.footer`
    width: 100%;
    display: flex; /* 한 줄 */
    justify-content: space-between; /* 좌우 끝 정렬 */
    align-items: center; /* 수직 가운데 */
    padding: 0.75rem 1rem; /* 높이도 살짝 축소 */
    background: #f9f9f9;
    color: #555;
    font-size: 0.8rem;
`;

const TextSection = styled.div`
    max-width: 550px;
    line-height: 1.25;
`;

const Address = styled.address`
    font-style: normal;
    margin: 0 0 0.25rem 0;
`;

const Copy = styled.p`
    margin: 0;
    color: #777;
`;

const LogoBox = styled.div`
    img {
        height: 48px; /* 필요하면 크기 조정 */
    }
`;
