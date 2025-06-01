import React, {useState} from "react";
import styled from "styled-components";

export default function ReplyForm({parentId, articleId, onReplyAdded}) {
    const [reply, setReply] = useState("");

    const handleSubmit = async () => {
        if (!reply.trim()) return;
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`http://localhost:8080/comments/${articleId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({content: reply, parentId}),
        });

        if (res.ok) {
            setReply("");
            onReplyAdded();
        } else {
            alert("대댓글 등록 실패");
        }
    };

    return (
        <div style={{marginLeft: "20px"}}>
      <textarea
          rows="2"
          placeholder="답글을 입력하세요"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
      />
            <SubmitButton onClick={handleSubmit}>답글 등록</SubmitButton>
        </div>
    );
}
const SubmitButton = styled.button`
    padding: 5px 10px;
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