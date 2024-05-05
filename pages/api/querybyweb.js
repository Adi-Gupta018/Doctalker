import { getCompletion, getEmbeddings } from "@/src/openaiServices";
import { Pinecone } from "@pinecone-database/pinecone";

async function connectToPinecone() {
    const pc = new Pinecone({
      apiKey: process.env.PDB_EDP_KEY,
    });
  
    try {
      const index = pc.Index('edp');
      const stats = await index.describeIndexStats();
      console.log(stats);
      if (index) console.log("connected to the index");
      return index; // Return  index objects
    } catch (error) {
      console.error("Error connecting to Pinecone:", error);
      throw error; // Re-throw the error for handling in the main function
    }
  }
  

export default async function handler(req,res){
    try {
        const query = req.body.query;
        const [queryEmbdPromise, connectPromise] = await Promise.all([
          getEmbeddings(query),
          connectToPinecone(),
        ]);
    
        const queryEmbd = await queryEmbdPromise;
        const index = await connectPromise;
        //converting to embeddings
        // const queryEmbd = await getEmbeddings(query);

        //connectiong pinecodeDB
        // const pc = new Pinecone({
        //     apiKey: process.env.PDB_KEY,
        //   });
        //   const index = pc.Index("doctalker");
        //   if (index) console.log("connected to the index");
        // const index = await connectToPinecone();
      
          // query the pinecone db
          // const ns = index.namespace('edp');
          let result = await index.query({
              vector: queryEmbd.values,
              topK: 5,
              includeValues: true,
              includeMetadata: true,
          })
      
          // get the metadata
          let contexts = result['matches'].map(item => item['metadata'].text)
      
          contexts = contexts.join("\n\n---\n\n")
      
          console.log('--contexts--', contexts)
      
          // Build the prompt with actual query straing and pinecone returned metadata
          const promptStart = "Answer the question based on the context below : \n\n";
          const promptEnd = `\n\n Question:${query} \n\nAnswer:`;
      
          const prompt = `${promptStart} ${contexts} ${promptEnd}`;
      
          // get the response from the completion model
          const response = await getCompletion(prompt);
          console.log("response from openAi",response);
          res.status(200).json({response});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
   
}