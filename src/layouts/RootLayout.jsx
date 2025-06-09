import {Outlet} from "react-router-dom";
import Header from "../components/common/Header.jsx";
import styled from "styled-components";

function RootLayout() {
    return (
        <Layout>
            <Header/>
            <Content>
                <Outlet/>
            </Content>
        </Layout>
    );
}

const Layout = styled.div`
    min-height: 100vh;
`;

const Content = styled.main`
    min-height: calc(
            100vh - 60px - 2rem
    ); // 최소 높이: 전체 높이 - 네비바 높이 - 푸터 높이
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default RootLayout;