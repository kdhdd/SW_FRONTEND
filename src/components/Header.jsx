import styled from "styled-components";
import Icon from "../assets/newspaper-regular.svg";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

function Header() {
    const {authUser, logout} = useAuth();
    const navigate = useNavigate();

    return (
        <HeaderWrapper>
            <Logo to="/">
                <img src={Icon} alt="handcuffs logo"/>
            </Logo>

            <MenuIcon/>

            <NavBar>
                <li><LinkStyled to="/">Home</LinkStyled></li>
                <li><LinkStyled to="/articles/page/1">최신 뉴스</LinkStyled></li>
                <li><LinkStyled to="/bookmarks">관심 뉴스</LinkStyled></li>
                <li><a href="#about">About</a></li>
                <li><a href="#reviews">Reviews</a></li>
            </NavBar>

            <HeaderBtn>
                {authUser ? (
                    <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <div style={{textAlign: "right", color: "#333", fontSize: "0.9rem", lineHeight: "1.2"}}>
                            <div>{authUser.username}</div>
                            <div>{authUser.nickname}님 ({authUser.role})</div>
                        </div>
                        <LogoutButton onClick={logout}>로그아웃</LogoutButton>
                    </div>
                ) : (
                    <>
                        <a onClick={() => navigate("/auth/signup")} className="sign-up">회원가입</a>
                        <a onClick={() => navigate("/auth/login")} className="sign-in">로그인</a>
                    </>
                )}
            </HeaderBtn>
        </HeaderWrapper>
    );
}

const HeaderWrapper = styled.header`
    position: fixed;
    width: 100%;
    top: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eeeff1;
    padding: 15px 100px;

    @media (max-width: 991px) {
        padding: 18px 40px;
    }
    @media (max-width: 795px) {
        padding: 11px 40px;
    }
    @media (max-width: 460px) {
        padding: 6px 14px;
    }
`;

const Logo = styled(Link)`
    img {
        width: 40px;

        @media (max-width: 460px) {
            width: 30px;
        }
    }
`;

const MenuIcon = styled.i.attrs({
    className: "bx bx-menu",
    id: "menu-icon",
})`
    font-size: 24px;
    cursor: pointer;
    z-index: 110;
    display: none;

    @media (max-width: 795px) {
        display: initial;
    }
`;

const NavBar = styled.ul.attrs({className: "navbar"})`
    display: flex;

    li {
        position: relative;
    }

    a {
        font-size: 1rem;
        padding: 10px 20px;
        color: var(--text-color);
        font-weight: 500;
        text-decoration: none;

        &::after {
            content: "";
            width: 0;
            height: 3px;
            background: var(--gradient);
            position: absolute;
            bottom: -4px;
            left: 0;
            transition: 0.5s;
        }

        &:hover::after {
            width: 100%;
        }
    }

    @media (max-width: 795px) {
        position: absolute;
        top: -500px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #ffffff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
        transition: 0.2s ease;
        text-align: left;

        &.active {
            top: 100%;
        }

        a {
            padding: 1rem;
            margin: 1rem;
            display: block;
            border-left: 2px solid var(--main-color);
            transition: 0.3s ease;

            &:hover {
                color: #ffffff;
                background: var(--main-color);
                border: none;
            }

            &::after {
                display: none;
            }
        }
    }
`;

// Link 스타일링한 버전 (SPA용)
const LinkStyled = styled(Link)`
    font-size: 1rem;
    padding: 10px 20px;
    color: var(--text-color);
    font-weight: 500;
    text-decoration: none;
    position: relative;

    &::after {
        content: "";
        width: 0;
        height: 3px;
        background: var(--gradient);
        position: absolute;
        bottom: -4px;
        left: 0;
        transition: 0.5s;
    }

    &:hover::after {
        width: 100%;
    }
`;

const HeaderBtn = styled.div.attrs({className: "header-btn"})`
    a {
        padding: 10px 20px;
        color: var(--text-color);
        font-weight: 500;
        cursor: pointer;
        display: inline-block;
        user-select: none;
        text-decoration: none;
    }

    .sign-in {
        background: black;
        color: #ffffff;
        border-radius: 0.5rem;
        transition: 0.5s;

        &:hover {
            background: var(--main-color);
        }
    }

    @media (max-width: 795px) {
        .sign-up {
            display: none;
        }
    }

    @media (max-width: 460px) {
        .sign-in {
            padding: 7px 10px;
            font-size: 14px;
            font-weight: 400;
        }
    }
`;

const LogoutButton = styled.button`
    background: black;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: 0.3s;

    &:hover {
        background: var(--main-color);
    }
`;

export default Header;
