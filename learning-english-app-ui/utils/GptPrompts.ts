export const getDefinitionInVietnamesePrompt = (word: string) => {
    return `Give me meaning of this word (${word}) following by definition. response in Vietnamese format
     English word: Vietnamese meaning amd definition. No yapping`;
}

export const getExamplePrompt = (word: string, partOfSpeech: string, definition: string) => {
    return `-(${word}) is a (${partOfSpeech}). And here is the meaning of this word 
    (${definition}). Give me 3 simple examples with this word. Response must be in bullet point like -. no yapping.`;
}
