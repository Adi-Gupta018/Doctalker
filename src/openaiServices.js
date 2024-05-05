import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);


export const getEmbeddings = async(text) =>{
    // const response = await openai.embeddings.create({
    //     model:'text-embedding-ada-002',
    //     input:text,
    // });
    // return response?.data[0]?.embedding

    const model = genAI.getGenerativeModel({ model: "embedding-001"});
    const result = await model.embedContent(text);
    const embedding = result.embedding;
   
    return embedding

}

export const getCompletion = async (prompt) => {
	// const comp = await openai.completions.create({
    //     model: "gpt-3.5-turbo-instruct",
    //     prompt: prompt, 
    //     temperature: 0,
    //     max_tokens: 500, //TODO have to change it later
    //   });

	// console.log(comp.choices[0].text.trim())

    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    // return comp.choices[0].text.trim();
    return result.response.text()
}
