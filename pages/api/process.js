"use client"
import * as PDFJS from "pdfjs-dist";
import { connectDB } from "@/src/db";
import MyFileModel from "@/src/models/MyFile";
import { getEmbeddings } from "@/src/openaiServices";
import { Pinecone } from "@pinecone-database/pinecone";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs"

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default async function handler(req, res) {
  // check for the post method
  if (req.method != "POST") {
    return res.status(400).json({ message: "Only post method is allowed" });
  }

  try {
    //connect to mongo
    await connectDB();

    // query by file id
    const { id } = req.body;
    console.log("id of file", id);
    const myFile = await MyFileModel.findById(id);

    if (!myFile) {
      return res.status(400).json({ message: "Invalid file" });
    }
    if (myFile.isProcessed) {
      return res.status(400).json({ message: "file is already processed" });
    }

    let vectors = [];

    let myFiledata = await fetch(myFile.fileUrl);

    if (myFiledata.ok) {
      let pdfDoc = await PDFJS.getDocument(await myFiledata.arrayBuffer())
        .promise;
      const numPages = pdfDoc.numPages;
      for (let i = 0; i < numPages; i++) {
        let page = await pdfDoc.getPage(i + 1); // in pdfdoc pages start from 1
        let textContent = await page.getTextContent();
        const text = textContent.items.map((item) => item.str).join("");

        // 5. Get embeddings for each page
        const embedding = await getEmbeddings(text);

        // 6. push to vector array
        vectors.push({
          id: `page${i + 1}`,
          values: embedding.values,
          metadata: {
            pageNum: i + 1,
            text,
          },
        });
      }
      // initialising pinecone and connectiong to the index
      console.log(myFile.fileName);
      if(!myFile.fileName.includes("EDP")){
      const pc = new Pinecone({
        apiKey: process.env.PDB_KEY,
      });
      const index = pc.Index("doctalker");
      if (index) console.log("connected to the index");

      // upsert data in the namespace
      // const ns = index.namespace(myFile.vectorNamespace);
      // await ns.upsert(vectors);
      await index.namespace(myFile.vectorNamespace).upsert(vectors);
    }
    else{
      const pc = new Pinecone({
        apiKey: process.env.PDB_EDP_KEY,
      });
      const index = pc.Index('edp');
      const stats = await index.describeIndexStats();
      console.log(stats);
      if(index) console.log("connected to edp");

      await index.upsert(vectors);
    }
      // update mongodb isprocessed to true
      myFile.isProcessed = true;
      await myFile.save();

      return res
        .status(200)
        .json({ message: "file is processed successfully, Happy chating :)" });
    }else{
        return res.status(500).json({message:"error getting file contents , please try again"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
  }
}
