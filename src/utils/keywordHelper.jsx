export const cleanText = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

export const extractKeywordsFromTitles = (titles) => {
    const cleanedTitles = titles.map(cleanText);

    const suffixes = [
        "했잖아", "했지만", "했으며", "했다", "했던", "했으나", "했", "하였", "하고",
        "한다", "하는", "한", "해", "하며", "하니",
        "되었지만", "되었으며", "되었다", "되었던", "되었", "되어", "되며", "된다", "되는", "된",
        "였던", "였으며", "였다", "였다가",
        "있다", "있으며", "있어", "없다", "없으며", "없어", "없는", "없",
        "에게서", "에게", "에서", "으로써", "으로서", "으로", "로써", "로서", "로",
        "을", "를", "이", "가", "은", "는", "도", "과", "와", "에", "의", "만", "뿐", "마다", "까지"
    ];

    const isKorean = (char) => /[가-힣]/.test(char);

    const removeSuffix = (word) => {
        for (const suffix of suffixes) {
            if (word.endsWith(suffix)) {
                const stem = word.slice(0, -suffix.length);
                if (stem.length >= 2 && isKorean(stem[stem.length - 1])) {
                    return removeSuffix(stem); // 재귀적으로 모든 어미 제거
                }
            }
        }
        return word;
    };

    const extractedWords = cleanedTitles.flatMap(title =>
        title
            .replace(/[^\w가-힣 ]/g, "")
            .split(/\s+/)
            .map(removeSuffix)
            .filter(word => word.length >= 2)
    );

    const filteredWords = extractedWords.filter(word =>
        cleanedTitles.some(title => title.includes(word))
    );

    return [...new Set(filteredWords)];
};
