import {useEffect, useState, createContext, useContext} from "react";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [authUser, setAuthUser] = useState(null); // { email, nickname }

    // 로그아웃
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthUser(null);
    };

    // ✅ 새로고침 시 user 정보 복구
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                console.log("🔍 /users/me 요청 시작");
                const res = await fetch("http://localhost:8080/users/me", {
                    headers: {
                        Authorization: token,
                    },
                });

                if (res.ok) {
                    const json = await res.json();
                    console.log("✅ /users/me 응답:", json);
                    setAuthUser(json.data); // data에 email, nickname, role 등
                } else {
                    console.warn("자동 로그인 실패");
                }
            } catch (err) {
                console.error("자동 로그인 중 오류 발생:", err);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{authUser, setAuthUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
