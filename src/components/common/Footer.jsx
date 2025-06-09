import React from "react";
import styled from "styled-components";

function Footer() {
    return (
        <FooterWrapper>
            <LogoBox>
                <img src="/src/assets/teamlogo.png" alt="알잘딱깔센 로고" />
            </LogoBox>

            <FooterLinks>
                <li><a href="#">이용약관</a></li>
                <li><a href="#">개인정보처리방침</a></li>
                <li><a href="#">이메일무단수집거부</a></li>
            </FooterLinks>

            <Address>서울특별시 성북구 서경로 124</Address>
            <Copy>COPYRIGHT© 2025 ALJALDDAGGALSAEN. ALL RIGHTS RESERVED.</Copy>
        </FooterWrapper>
    );
}

export default Footer;

const FooterWrapper = styled.footer`
    width: 100%;
    background-color: #f9f9f9;  // ✅ 어두운 배경으로 통일
    padding: 2rem 1rem;
    color: #555;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;  // ✅ 왼쪽 정렬
`;

const LogoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;

    img {
        height: 60px;
    }

    h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: #222;
    }
`;

const FooterLinks = styled.ul`
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin-bottom: 0.5rem;

    li {
        border-right: 1px solid #555;
        padding-right: 1rem;
    }

    li:last-child {
        border-right: none;
    }

    a {
        text-decoration: none;
        color: #555;

        &:hover {
            color: #000;
        }
    }
`;

const Address = styled.address`
    font-style: normal;
    margin-top: 0.5rem;
`;

const Copy = styled.p`
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: #777;
`;
