import React from "react";
import styled from "styled-components";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import SentimentDonutChart from "./SentimentDonutChart";

export default function CommentSection(
    {
        articleId,
        onCommentAdded,
        currentUser,
        comments,
        editContent,
        setEditContent,
        editingCommentId,
        setEditingCommentId,
        handleUpdateComment,
        handleDeleteComment,
        //replyFormVisibleId,
        //setReplyFormVisibleId,
        fetchComments,
        openMenuId,
        toggleMenu,
        sentimentData,
        isSentimentLoading
    }) {
    const policeStats = sentimentData.find(s => s.userRole === "POLICE");
    const userStats = sentimentData.find(s => s.userRole === "USER");
    const hasValidData = (stats) =>
        stats && (stats.positive > 0 || stats.negative > 0 || stats.neutral > 0);

    return (
        <Wrapper>
            <h3>댓글</h3>
            <CommentForm articleId={articleId} onCommentAdded={onCommentAdded}/>

            <ChartWrapper>
                {/* 댓글이 없으면 아무것도 보여주지 않음 */}
                {comments.length === 0 && (
                    <p style={{textAlign: "center", margin: "10px 0"}}>📝 분석할 의견이 없습니다.</p>
                )}

                {/* 댓글은 있는데 감정 분석 중일 때 */}
                {comments.length > 0 && isSentimentLoading && (
                    <p style={{textAlign: "center", margin: "10px 0"}}>⚙️ 의견 분석 중입니다...</p>
                )}

                {/* 댓글이 있을 때만 차트 렌더링 */}
                {comments.length > 0 && (
                    <ChartRow>
                        {hasValidData(policeStats) && (
                            <ChartContainer>
                                <ChartTitle>POLICE 댓글 통계</ChartTitle>
                                <SentimentDonutChart stats={policeStats}/>
                            </ChartContainer>
                        )}
                        {hasValidData(userStats) && (
                            <ChartContainer>
                                <ChartTitle>USER 댓글 통계</ChartTitle>
                                <SentimentDonutChart stats={userStats}/>
                            </ChartContainer>
                        )}
                    </ChartRow>
                )}

            </ChartWrapper>


            <TwoColumnWrapper>
                <div className="column left">
                    {comments.filter(c => c.parentId == null && c.role === "POLICE").map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            comments={comments}
                            fetchComments={fetchComments}
                            articleId={articleId}
                            onCommentAdded={onCommentAdded}
                            openMenuId={openMenuId}
                            toggleMenu={toggleMenu}
                        />

                    ))}
                </div>
                <div className="column right">
                    {comments.filter(c => c.parentId == null && c.role === "USER").map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            handleUpdateComment={handleUpdateComment}
                            handleDeleteComment={handleDeleteComment}
                            comments={comments}
                            fetchComments={fetchComments}
                            articleId={articleId}
                            openMenuId={openMenuId}
                            toggleMenu={toggleMenu}
                        />

                    ))}
                </div>
            </TwoColumnWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 40px;
`;

const TwoColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    .column {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .left {
        align-items: flex-start;
    }

    .right {
        align-items: flex-end;
    }
`;

const ChartRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 240px;
    margin: 0 0 10px;
`;

const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ChartTitle = styled.div`
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
`;

const ChartWrapper = styled.div`
    background: rgba(255, 255, 255, 0.6);
    padding: 10px;
    border-radius: 16px;
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 30px 0;
`;
