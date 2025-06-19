import styled from "styled-components";
import Icon from "../../assets/newspaper-regular.svg";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SwalGlobalStyle from "../../styles/SwalGlobalStyle.jsx";

function Header() {
    const {authUser, logout} = useAuth();
    const navigate = useNavigate();


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
                    <img src={Icon} alt="handcuffs logo"/>
                </Logo>

                <MenuIcon/>

                <NavBar>
                    <li><LinkStyled to="/">홈</LinkStyled></li>
                    <li><LinkStyled to="/articles/page/1">뉴스 보기</LinkStyled></li>
                    <li><LinkStyled to="/calendar">이슈 캘린더</LinkStyled></li>
                    <li><LinkStyled to="/about">서비스 소개</LinkStyled></li>
                </NavBar>

                <HeaderBtn>
                    {!authUser && (
                        <DropdownWrapper>
                            <UserIcon/>
                            <DropdownContent>
                                <div onClick={() => navigate("/auth/login")}>로그인</div>
                                <div onClick={() => navigate("/auth/signup")}>회원가입</div>
                            </DropdownContent>
                        </DropdownWrapper>
                    )}
                    {authUser && (
                        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                            <div style={{fontSize: "1rem", whiteSpace: "nowrap", color: "#333"}}>
                                {authUser.nickname}님{" "}
                                <span style={{color: authUser.role === "POLICE" ? "#1e88e5" : "#333"}}>
                ({authUser.role})
            </span>
                            </div>
                            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                        </div>
                    )}

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

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        height: 1px;
        background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0.0) 0%, /* 시작도 완전 투명 X */ lightgray 25%,
                lightgray 75%,
                rgba(0, 0, 0, 0.0) 100% /* 끝도 약간 보이게 */
        );
    }

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
    justify-content: center;
    flex: 1; // 중앙에 고정됨
    gap: 5rem;
    list-style: none;
    margin: 0;
    padding: 0;

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

    @media (max-width: 795px) {
        flex: none;
        flex-direction: column;
        position: absolute;
        top: -500px;
        left: 0;
        right: 0;
        background: #ffffff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
        text-align: left;
        transition: 0.2s ease;

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
    width: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

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

const UserIcon = styled(FontAwesomeIcon).attrs({
    icon: faUser,
})`
    font-size: 1.6rem;
    color: black;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
`;

const DropdownContent = styled.div`
    display: none;
    position: absolute;
    top: 100%; /* 아이콘 바로 아래에 붙이기 */
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    z-index: 1000;

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
`;

export default Header;