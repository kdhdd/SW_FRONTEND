import styled from "styled-components";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SwalGlobalStyle from "../../styles/SwalGlobalStyle.jsx";
import logo from '../../assets/logo.png';
import policeBadge from "../../assets/policeBadge.png";
import {useEffect, useRef, useState} from "react";

function Header() {
    const {authUser, logout} = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleMenu = () => setMenuOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);


    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "로그아웃 하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "로그아웃",
            cancelButtonText: "취소",
            customClass: {
                popup: "custom-swal-popup",
                confirmButton: "custom-swal-button",
                cancelButton: "custom-swal-button",
            }
        });

        if (result.isConfirmed) {
            logout();
            window.location.reload();
        }
    };

    return (
        <> <SwalGlobalStyle/>
            <HeaderWrapper>
                <Logo to="/">
                    <LogoImg src={logo} alt="logo"/>
                </Logo>
                {menuOpen && window.innerWidth <= 768 ? (
                    <NavBar $isOpen={menuOpen}>
                        <MobileNavHeader>
                            <LogoImg src={logo} alt="logo"/>
                            <CloseBtn onClick={() => setMenuOpen(false)}>×</CloseBtn>
                        </MobileNavHeader>
                        <li><LinkStyled to="/" onClick={() => setMenuOpen(false)}>홈</LinkStyled></li>
                        <li><LinkStyled to="/articles/page/1" onClick={() => setMenuOpen(false)}>뉴스 보기</LinkStyled></li>
                        <li><LinkStyled to="/calendar" onClick={() => setMenuOpen(false)}>이슈 캘린더</LinkStyled></li>
                        <li><LinkStyled to="/about" onClick={() => setMenuOpen(false)}>서비스 소개</LinkStyled></li>
                    </NavBar>
                ) : (
                    <NavBar>
                        <li><LinkStyled to="/" onClick={() => setMenuOpen(false)}>홈</LinkStyled></li>
                        <li><LinkStyled to="/articles/page/1" onClick={() => setMenuOpen(false)}>뉴스 보기</LinkStyled></li>
                        <li><LinkStyled to="/calendar" onClick={() => setMenuOpen(false)}>이슈 캘린더</LinkStyled></li>
                        <li><LinkStyled to="/about" onClick={() => setMenuOpen(false)}>서비스 소개</LinkStyled></li>
                    </NavBar>
                )}

                <HeaderBtn>
                    {!authUser ? (
                        <DropdownWrapper
                            ref={dropdownRef}
                            onMouseEnter={() => {
                                if (window.innerWidth > 768) setDropdownOpen(true);
                            }}
                            onMouseLeave={() => {
                                if (window.innerWidth > 768) setDropdownOpen(false);
                            }}
                        >
                            <UserIcon
                                icon={faUser}
                                onClick={() => {
                                    if (window.innerWidth <= 768) setDropdownOpen(prev => !prev);
                                }}
                            />
                            {dropdownOpen && (
                                <DropdownContent>
                                    <div onClick={() => {
                                        setDropdownOpen(false);
                                        navigate("/auth/login");
                                    }}>로그인
                                    </div>
                                    <div onClick={() => {
                                        setDropdownOpen(false);
                                        navigate("/auth/signup");
                                    }}>회원가입
                                    </div>
                                </DropdownContent>
                            )}
                        </DropdownWrapper>


                    ) : (
                        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                            <div style={{
                                fontSize: "1rem",
                                whiteSpace: "nowrap",
                                color: "#333",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem"
                            }}>
                                {authUser.nickname}님{" "}
                                {authUser.role === "POLICE" && (
                                    <img src={policeBadge} alt="경찰 뱃지" style={{width: "20px", height: "20px"}}/>
                                )}
                            </div>
                            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                        </div>
                    )}

                    <MenuIcon onClick={toggleMenu}/>
                </HeaderBtn>
            </HeaderWrapper>
        </>
    );
}

const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background: white;
    padding: 15px 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        height: 1px;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.0) 0%, lightgray 25%, lightgray 75%, rgba(0, 0, 0, 0.0) 100%);
    }

    @media (max-width: 991px) {
        padding: 18px 40px;
    }

    @media (max-width: 768px) {
        padding: 12px 20px;
    }
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    overflow: visible;
`;

const MenuIcon = styled.i.attrs({
    className: "bx bx-menu",
    id: "menu-icon",
})`
    font-size: 24px;
    cursor: pointer;
    z-index: 110;
    display: none;

    @media (max-width: 768px) {
        display: block;
        margin-left: 12px;
    }
`;

const NavBar = styled.ul.attrs({className: "navbar"})`
    display: flex;
    justify-content: center;
    flex: 1;
    gap: 5rem;
    list-style: none;

    li {
        position: relative;
    }

    a {
        font-size: 1.3rem;
        padding: 10px 0;
        font-weight: 500;
        text-decoration: none;
        position: relative;

        &::after {
            content: "";
            width: 0;
            height: 3px;
            position: absolute;
            bottom: -4px;
            left: 0;
            transition: 0.5s;
        }

        &:hover::after {
            width: 100%;
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: white;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        z-index: 999;
        gap: 0;
        transform: ${({$isOpen}) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
        opacity: ${({$isOpen}) => ($isOpen ? 1 : 0)};
        pointer-events: ${({$isOpen}) => ($isOpen ? "auto" : "none")};
        transition: all 0.3s ease-in-out;

        li {

            width: 100%;

            a {
                display: block;
                width: 100%;
                padding: 1rem 1.5rem; /* ✅ 간격 축소 */
                font-size: 1.1rem;
                color: #333;
                border-bottom: 1px solid #eee;

                &:hover {
                    background-color: #f5f5f5;
                }
            }
        }
    }
`;

const MobileNavHeader = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;   // ✅ 좌우 정렬
        align-items: center;
        width: 100%;                      // ✅ 전체 너비 사용
        padding: 0.6rem 1rem;             // ✅ 간격 살짝 축소
        border-bottom: 1px solid #eee;

        img {
            height: 36px;
        }
    }
`;


const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    color: #333;
    cursor: pointer;
`;

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
        position: absolute;
        bottom: -4px;
        left: 0;
        transition: 0.5s;
    }

    &:hover::after {
        width: 50%;
    }
`;


const HeaderBtn = styled.div.attrs({className: "header-btn"})`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @media (max-width: 768px) {
        width: auto;
    }

    a {
        padding: 10px 20px;
        color: var(--text-color);
        font-weight: 500;
        cursor: pointer;
        display: inline-block;
        user-select: none;
        text-decoration: none;
    }
`;

const LogoutButton = styled.button`
    background: black;
    color: white;
    padding: 8px 16px;
    min-width: 80px;
    white-space: nowrap;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: 0.3s;

    &:hover {
        background: var(--main-color);
    }
`;

const DropdownWrapper = styled.div`
    position: relative;
    display: inline-block;

    &:hover > div {
        display: block;
    }
`;

const UserIcon = styled(FontAwesomeIcon)`
    font-size: 1.6rem;
    color: black;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;

    @media (max-width: 480px) {
        font-size: 1.4rem;
    }
`;

const DropdownContent = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    z-index: 1000;
    min-width: 120px;

    div {
        padding: 0.5rem 1.2rem;
        font-size: 0.9rem;
        color: #333;
        white-space: nowrap;
        transition: 0.2s;

        &:hover {
            background-color: #f2f2f2;
        }
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
    }
`;


const LogoImg = styled.img`
    height: 45px;
    width: auto;
    object-fit: contain;

    @media (max-width: 480px) {
        height: 38px;
    }
`;

export default Header;