import React, {useState} from "react";
import styled, {keyframes} from "styled-components";
import {useNavigate} from "react-router-dom";
import {showSignupSuccessAlert} from "../utils/alert";

const hueRotate = keyframes`
    from {
        filter: grayscale(30%) hue-rotate(0deg);
    }
    to {
        filter: grayscale(30%) hue-rotate(360deg);
    }
`;

const UnderlayPhoto = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    background: url('https://31.media.tumblr.com/41c01e3f366d61793e5a3df70e46b462/tumblr_n4vc8sDHsd1st5lhmo1_1280.jpg');
    background-size: cover;
    z-index: -1;
    animation: ${hueRotate} 6s infinite;
    -webkit-filter: grayscale(30%);
`;

const UnderlayBlack = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: -1;
`;

const FormWrapper = styled.div`
    max-width: 50%;
    margin: 150px auto;
    padding: 0.5rem;
    text-align: center;
`;

const Title = styled.h1`
    color: white;
    margin-bottom: 2rem;
`;

const FullInput = styled.input`
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    margin: 1rem 0;
    padding: 0.5rem;
    width: calc(100% - 3rem);
    transition: 250ms background ease-in;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        outline: none;
        background: white;
        color: black;

        &::placeholder {
            color: rgba(0, 0, 0, 0.7);
        }
    }
`;

const CodeInput = styled(FullInput)`
    width: 150px;
    margin: 0.5rem 0;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem 0;
`;

const Button = styled.button`
    border: 1px solid white;
    background: transparent;
    color: white;
    padding: 0.5rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    transition: 250ms background ease-in;

    &:hover,
    &:focus {
        background: white;
        color: black;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

export default function SignupPage({type}) {
    const [codeSent, setCodeSent] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate(); // ⬅️ 추가
    const [codeMessage, setCodeMessage] = useState(""); // 인증 관련 메시지
    const [codeMessageColor, setCodeMessageColor] = useState("white"); // 성공/실패 색상

    const sendVerificationCode = async () => {
        try {
            const endpoint = type === "police"
                ? "https://crimearticle.net/user-service/signup/police/email"
                : "https://crimearticle.net/user-service/signup/general/email";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
                credentials: "include",
            });

            if (res.ok) {
                setCodeSent(true);
                setCodeMessage("인증번호 전송 완료 ✅");
                setCodeMessageColor("lightgreen");
            } else {
                setCodeMessage("이메일 전송 실패 ❌");
                setCodeMessageColor("tomato");
            }
        } catch (err) {
            setCodeMessage("서버 오류 발생 ❌");
            setCodeMessageColor("tomato");
            console.error(err);
        }
    };

    const verifyCode = async () => {
        const endpoint = type === "police"
            ? "https://crimearticle.net/user-service/signup/police/emailAuth"
            : "https://crimearticle.net/user-service/signup/general/emailAuth";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, authNum: code}),
            });

            if (res.ok) {
                setEmailVerified(true);
                setCodeMessage("이메일 인증 성공 🎉");
                setCodeMessageColor("lightgreen");
            } else {
                setCodeMessage("인증번호가 틀렸습니다 ❌");
                setCodeMessageColor("tomato");
            }
        } catch (err) {
            setCodeMessage("서버 오류 발생 ❌");
            setCodeMessageColor("tomato");
            console.error(err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!emailVerified) {
            alert("이메일 인증을 먼저 완료하세요.");
            return;
        }
        const url = type === "police"
            ? "https://crimearticle.net/user-service/users/police"
            : "https://crimearticle.net/user-service/users/general";

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: email, password, name, nickname}),
            });

            if (res.ok) {
                await showSignupSuccessAlert(navigate);
            } else {
                const data = await res.json();
                alert(data.message || "회원가입 실패");
            }
        } catch (err) {
            alert("회원가입 오류 발생");
            console.error(err);
        }
    };


    return (
        <>
            <UnderlayPhoto/>
            <UnderlayBlack/>
            <FormWrapper>
                <Title>{type === "police" ? "경찰 회원가입" : "일반 회원가입"}</Title>

                <form onSubmit={handleRegister}>
                    <Row>
                        <FullInput
                            type="email"
                            placeholder={type === "police" ? "email@skuniv.ac.kr" : "email@example.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <CodeInput
                            type="text"
                            placeholder="인증번호"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />

                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Button
                                type="button"
                                onClick={
                                    emailVerified
                                        ? null
                                        : codeSent
                                            ? verifyCode
                                            : sendVerificationCode
                                }
                                disabled={emailVerified}
                            >
                                {emailVerified
                                    ? "인증 완료"
                                    : codeSent
                                        ? "인증번호 확인"
                                        : "인증번호 전송"}
                            </Button>

                            {codeMessage && (
                                <div
                                    style={{
                                        color: codeMessageColor,
                                        fontSize: "0.9rem",
                                        marginTop: "0.4rem",
                                        textAlign: "right",
                                        whiteSpace: "nowrap", // 줄바꿈 방지
                                        width: "max-content", // 혹은 100%
                                    }}
                                >
                                    {codeMessage}
                                </div>

                            )}
                        </div>
                    </Row>

                    <FullInput
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <FullInput
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    <FullInput
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={!emailVerified}>
                        회원가입
                    </Button>
                </form>
            </FormWrapper>
        </>
    );
}