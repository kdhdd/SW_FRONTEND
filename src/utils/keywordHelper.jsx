export const cleanText = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

export const extractKeywordsFromTitles = (titles) => {
    const cleanedTitles = titles.map(cleanText);

    const suffixes = [
        "에서", "으로", "이고", "이며", "까지",
        "하다", "했다", "하는", "되다", "된다", "된",
        "은", "는", "이", "가", "를", "을", "도", "에", "와", "과", "의", "로", "만"
    ];

    const extractedWords = cleanedTitles.flatMap(title =>
        title
            .replace(/[^\w가-힣]/g, " ")
            .split(/\s+/)
            .map(word => {
                for (const suffix of suffixes) {
                    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
                        return word.slice(0, -suffix.length);
                    }
                }
                return word;
            })
            .filter(word =>
                word.length >= 2 &&
                /^[가-힣a-zA-Z0-9]+$/.test(word)
            )
    );

    // 🔥 제목에 실질적으로 포함된 단어만
    const filteredWords = extractedWords.filter(word =>
        cleanedTitles.some(title =>
            new RegExp(`\\b${word}\\b`).test(title) || title.includes(word)
        )
    );

    return Array.from(new Set(filteredWords));
};
