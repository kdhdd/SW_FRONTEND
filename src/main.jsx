import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from "./App.jsx";
import "./App.css";
import ScrollToTop from './components/common/ScrollToTop';

import RootLayout from "./layouts/RootLayout.jsx";
import LoginPage from './pages/LoginPage.jsx';
import SignupSelectPage from "./pages/SignupSelectPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import {AuthProvider} from "./contexts/AuthContext";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";

import SearchResultPage from "./pages/SearchResultPage";
import AboutPage from "./pages/AboutPage.jsx";

import IssueCalendarPage from "./pages/IssueCalendarPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                <Route path="/" element={<RootLayout/>}>
                    <Route index element={<App/>}/>
                    <Route path="auth/login" element={<LoginPage/>}/>
                    <Route path="auth/signup" element={<SignupSelectPage/>}/>

                    <Route path="/auth/signup/police" element={<SignupPage type="police"/>}/>
                    <Route path="/auth/signup/general" element={<SignupPage type="general"/>}/>

                    <Route path="/articles/page/:page" element={<ArticlesPage/>}/>
                    <Route path="/articles/:id" element={<ArticleDetailPage/>}/>

                    <Route path="/search-result" element={<SearchResultPage/>}/>
                    <Route path="/calendar" element={<IssueCalendarPage/>}/>


                    <Route path="/about" element={<AboutPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);
