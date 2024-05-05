import { connectDB } from "@/src/db";
import MyFileModel from "@/src/models/MyFile";
import { getCompletion, getEmbeddings } from "@/src/openaiServices";
import { Pinecone } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
  // check for the post method
  if (req.method != "POST") {
    return res.status(400).json({ message: "invalid request" });
  }
  try {
    // connect to mongo
    await connectDB();

    // query the file by id
    const { query, id } = req.body;

    const myFile = await MyFileModel.findById(id);

    if (!myFile) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    // get the embeddings for the query
    const questionEmb = await getEmbeddings(query);

    // initializing pinecone and connectiong to index
    const pc = new Pinecone({
      apiKey: process.env.PDB_KEY,
    });
    const index = pc.Index("doctalker");
    if (index) console.log("connected to the index");

    // query the pinecone db
    const ns = index.namespace(myFile.vectorNamespace);
    let result = await ns.query({
        vector: questionEmb.values,
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
    console.log(error);
    return res.status(500).json({message:error.message});
  }
}
