import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getEmbeddings = async(text) =>{
    const response = await openai.embeddings.create({
        model:'text-embedding-ada-002',
        input:text,
    });
    return response?.data[0]?.embedding
}

export const getCompletion = async (prompt) => {
	const comp = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt, 
        temperature: 0,
        max_tokens: 300, //TODO have to change it later
      });

	console.log(comp.choices[0].text.trim())

    return comp.choices[0].text.trim();
}
