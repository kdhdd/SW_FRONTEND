import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import policeBadge from "../../assets/policeBadge.png";

function CommentItem({
                         comment,
                         currentUser,
                         editContent,
                         setEditContent,
                         editingCommentId,
                         setEditingCommentId,
                         handleUpdateComment,
                         handleDeleteComment,
                         openMenuId,
                         toggleMenu
                     }) {
    const isEditing = editingCommentId === comment.id;
    const isOwn = currentUser?.username === comment.username;

    // ✅ 메뉴 영역 감지용 ref
    const menuRef = useRef();

    // ✅ 외부 클릭 감지 로직
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId === comment.id && menuRef.current && !menuRef.current.contains(event.target)) {
                toggleMenu(null); // 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId, comment.id, toggleMenu]);

    return (
        <CommentContainer>
            <CommentBox className={comment.parentId ? "reply" : ""}>
                <Meta>
                    <TopRow>
                        <UserInfo>
                            {comment.nickname}
                            {comment.role === "POLICE" && (
                                <BadgeImage src={policeBadge} alt="police badge"/>
                            )}
                        </UserInfo>

                        {isOwn && (
                            <MenuWrapper ref={menuRef}> {/* ✅ ref 연결 */}
                                <MenuButton onClick={() => toggleMenu(comment.id)}>⋯</MenuButton>
                                {openMenuId === comment.id && (
                                    <MenuDropdown>
                                        <button onClick={() => {
                                            toggleMenu(null);
                                            setEditingCommentId(comment.id);
                                            setEditContent(comment.content);
                                        }}>수정
                                        </button>
                                        <button onClick={() => {
                                            toggleMenu(null);
                                            handleDeleteComment(comment.id)
                                        }}>삭제
                                        </button>
                                    </MenuDropdown>
                                )}
                            </MenuWrapper>
                        )}
                    </TopRow>
                </Meta>

                {isEditing ? (
                    <>
                        <textarea
                            rows="2"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <Actions>
                            <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
                            <button onClick={() => setEditingCommentId(null)}>취소</button>
                        </Actions>
                    </>
                ) : (
                    <>
                        <Content>{comment.parentId ? `└ ${comment.content}` : comment.content}</Content>
                        <InfoRow>
                            <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </InfoRow>
                    </>
                )}

            </CommentBox>
        </CommentContainer>
    );
}

export default CommentItem;

const CommentContainer = styled.div`
    list-style: none;
`;

const CommentBox = styled.div`
    width: 320px;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
`;

const Meta = styled.div`
    font-size: 0.85rem;
    color: #888;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MenuWrapper = styled.div`
    position: relative;
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: #888;
`;

const MenuDropdown = styled.div`
    position: absolute;
    top: 24px;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    z-index: 10;
    padding: 8px 0;
    min-width: 80px;

    button {
        background: none;
        border: none;
        width: 100%;
        padding: 8px 16px;
        text-align: left;
        font-size: 0.95rem;
        color: #222;
        cursor: pointer;

        &:hover {
            background-color: #f5f5f5;
        }
    }
`;

const Content = styled.div`
    font-size: 1rem;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #888;
`;

const Actions = styled.div`
    display: flex;
    gap: 0.5rem;

    button {
        padding: 4px 12px;
        font-size: 0.9rem;
        border: none;
        border-radius: 4px;
        background: #e6f0ff;
        color: #007bff;
        cursor: pointer;

        &:hover {
            background: #d0e5ff;
        }
    }
`;

const UserInfo = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const BadgeImage = styled.img`
    width: 20px;
    height: 20px;
    object-fit: contain;
`;
