import {Pinecone} from "@pinecone-database/pinecone"

export const pinecone = async()=>{
    try {
        const pc = new Pinecone({
            apiKey: process.env.PDB_KEY,
        })
        console.log("Pinecone initialized");
    } catch (error) {
        console.error("Pinecone not initialized",error);
    }
}

