const toUpperCamelCase = (title: string) =>
    title.split(/ /g).map(word => {
        let wordLower = word.toLowerCase()
        if (['a', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de',
            'desde', 'en', 'entre', 'hacia', 'hasta', 'mediante',
            'para', 'por', 'según', 'segun', 'sin', 'so', 'sobre',
            'tras', 'durante', 'mediante', 'vía', 'via', 'versus',
            'y', 'e', 'ni', 'que', 'o', 'u', 'bien', 'pero', 'ya', 'al', 'del', 'el'].includes(wordLower)) {
            return wordLower
        }
        else {
            return `${wordLower.substring(0, 1).toUpperCase()}${wordLower.substring(1)}`
        }
    }).join(" ");

export default toUpperCamelCase;