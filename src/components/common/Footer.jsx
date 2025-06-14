import React from "react";
import styled from "styled-components";

function Footer() {
    return (
        <FooterWrapper>
            <TextSection>
                <FooterLinks>
                    <li><a href="#">이용약관</a></li>
                    <li><a href="#">개인정보처리방침</a></li>
                    <li><a href="#">이메일무단수집거부</a></li>
                </FooterLinks>

                <Address>서울특별시 성북구 서경로 124</Address>
                <Copy>COPYRIGHT© 2025 ALJALDDAGGALSAEN. ALL RIGHTS RESERVED.</Copy>

                <LogoBox>
                    <img src="/src/assets/teamlogo.png" alt="알잘딱깔센 로고"/>
                </LogoBox>
            </TextSection>
        </FooterWrapper>
    );
}


export default Footer;

const FooterWrapper = styled.footer`
    width: 100%;
    align-items: flex-start;
    background-color: #f9f9f9;
    padding: 2rem 1rem;
    color: #555;
`;

const TextSection = styled.div`
    position: relative;
    max-width: 550px;
    padding-right: 100px;
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
    margin-bottom: 0.3rem;
`;

const Copy = styled.p`
    font-size: 0.85rem;
    color: #777;
    margin-bottom: 0;
`;

const LogoBox = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;

    img {
        height: 60px;
    }
`;
