import { useState } from "react";

function Register() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");

    // 이메일로 인증번호 요청
    const sendVerificationCode = async () => {
        try {
            const res = await fetch("http://localhost:8080/signup/police/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
                credentials: "include", // ✅ 있으면 백엔드 allowCredentials 필수!
            })

            if (res.ok) {
                alert("인증번호가 이메일로 전송되었습니다.");
                setStep(2);
            } else {
                alert("이메일 전송 실패");
            }
        } catch (err) {
            alert("서버 오류 발생");
            console.error(err);
        }
    };

    // 인증번호 검증
    const verifyCode = async () => {
        try {
            const res = await fetch("http://localhost:8080/signup/police/emailAuth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, authNum: code }),
            });

            if (res.ok) {
                alert("이메일 인증 성공!");
                setStep(3);
            } else {
                alert("인증번호가 틀렸습니다.");
            }
        } catch (err) {
            alert("서버 오류 발생");
            console.error(err);
        }
    };

    // 회원가입 요청
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/users/police", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email,
                    password,
                    name,
                    nickname,
                }),
            });

            if (res.ok) {
                alert("회원가입 완료!");
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
        <div style={{ paddingTop: "100px", textAlign: "center" }}>
            <h1>회원가입</h1>

            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="이메일 주소"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <button onClick={sendVerificationCode} style={{ marginTop: "10px" }}>
                        인증번호 받기
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="인증번호"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <br />
                    <button onClick={verifyCode} style={{ marginTop: "10px" }}>
                        인증번호 확인
                    </button>
                </>
            )}

            {step === 3 && (
                <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
                    <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    /><br />
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    /><br />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br />
                    <button type="submit" style={{ marginTop: "10px" }}>
                        회원가입
                    </button>
                </form>
            )}
        </div>
    );
}

export default Register;
