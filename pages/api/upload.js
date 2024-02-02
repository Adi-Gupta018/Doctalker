import { connectDB } from "@/src/db";
import { s3Upload } from "@/src/s3services";
import MyFileModel from "@/src/models/MyFile";
import formidable from "formidable";
import { Pinecone } from "@pinecone-database/pinecone";


export const config = {
  api:{
    bodyParser: false, // Disabling the builtin middleware for parsing bodies
  }
}

export default async function handler(req, res) {
  // 1 only post method is allowed
  if (req.method != "POST") {
    return res.status(400).json({ message: "method is not allowed" });
  }

  try {
    // 2 connect mongoDB
    await connectDB();

    // 3 parse the incoming file
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        console.log("failed to parse data");
        return res.status(500).json({ message: error });
      }

      const file = files.file;
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
      }
      //4 upload the file to aws
      let data = await s3Upload(process.env.S3_BUCKET, file);

      const filenameWithoutExt = file.name.split(".")[0];
      const filenameSlug = slugify(filenameWithoutExt, {
        lower: true,
        strict: true,
      });

      //5 initialise pinecone
      const pc = new Pinecone({
        apiKey: process.env.PDB_KEY,
      });
      const res = await pc.listIndexes();
      if (res) {
        console.log("pinecone Initialised");
      }

      // save file in mongo db
      const myFile = new MyFileModel({
        fileName: file.name,
        fileUrl: data.Location,
        vectorNamespace: filenameSlug,
      });
      await myFile.save();
      res.status(200).json({ message: "File uploaded" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
