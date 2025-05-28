import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login_Backup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const res = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            // ✅ 응답이 JSON이 아닌 경우, 헤더에서 직접 토큰 꺼내기
            if (res.ok) {
                const accessToken = res.headers.get("accessToken");
                const refreshToken = res.headers.get("refreshToken");

                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    alert("로그인 성공!");
                    navigate("/"); //홈으로 이동
                } else {
                    alert("로그인은 되었지만 토큰이 없습니다.");
                }
            } else {
                const errorText = await res.text(); // ✅ 혹시 JSON이 아닐 수 있으므로 text()로 받기
                alert("로그인 실패: " + errorText);
            }
        } catch (err) {
            alert("서버 오류 발생");
            console.error(err);
        }
    };

    return (
        <div style={{paddingTop: "100px", textAlign: "center"}}>
            <h1>로그인</h1>
            <form onSubmit={handleLogin} style={{display: "inline-block", marginTop: "20px"}}>
                <div>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{marginTop: "10px"}}>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{marginTop: "20px"}}>로그인</button>
            </form>
        </div>
    );
}

export default Login_Backup;
