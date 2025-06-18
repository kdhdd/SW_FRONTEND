import React, {useState} from 'react';
import styled from 'styled-components';
import {showLoginRequiredAlert} from "../../utils/alert.jsx";
import {useNavigate} from "react-router-dom";
import SwalGlobalStyle from "../../styles/SwalGlobalStyle.jsx";

export default function CommentForm({articleId, onCommentAdded}) {
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!content.trim()) return;
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`https://crimearticle.net/article-service/comments/${articleId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify({content}),
            });

            console.log("보낼 accessToken:", token);

            if (res.ok) {
                setContent("");
                onCommentAdded();
            } else {
                await showLoginRequiredAlert(navigate);
            }
        } catch (err) {
            await showLoginRequiredAlert(navigate);
            console.error("댓글 등록 에러:", err);
        }
    };

    return (
        <>
            <SwalGlobalStyle/>
            <FormContainer>
                <StyledTextarea
                    rows="5"
                    placeholder="따뜻한 댓글은 모두에게 힘이 됩니다"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <ButtonWrapper>
                    <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
                </ButtonWrapper>
            </FormContainer>
        </>
    );
}

const FormContainer = styled.div`
    margin: 24px 0;
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 14px 16px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    resize: vertical;
    outline: none;
    transition: border 0.3s ease;

    &:focus {
        border-color: var(--main-color);
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    font-size: 0.95rem;
    font-weight: bold;
    color: white;
    background-color: var(--main-color);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.25s ease;

    &:hover {
        background-color: #333;
    }
`;
