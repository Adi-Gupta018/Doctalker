import { connectDB } from '@/src/db';
import MyFileModel from "@/src/models/MyFile";
import { Pinecone } from "@pinecone-database/pinecone";
import toast from 'react-hot-toast';
import { s3delete } from '@/src/s3services';



export default async function handler(req,res){
  // deleting from pinecone
  const pc = new Pinecone({
    apiKey: process.env.PDB_KEY,
  });
  const file = req.body;
  // console.log(file,"delete.js");
  if(file.isProcessed){
  const index = pc.Index("doctalker");
  if (index) console.log("connected to the index");
  try {
    const ns = index.namespace(file.vectorNamespace);
    await ns.deleteAll();
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error});
  }
  }

  // delete from aws s3
  try {
    await s3delete(process.env.S3_BUCKET, file.fileName);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error});
  } 

  // delete from mongo
  await connectDB();
  try {
    await MyFileModel.findByIdAndDelete(file._id);
    toast.success("File deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error});
  }

  res.status(200).json({message:"File deleted successfully"});
};
