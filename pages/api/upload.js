import { connectDB } from "@/src/db";
import { s3Upload } from "@/src/s3services";
import MyFileModel from "@/src/models/MyFile";
import formidable from "formidable";
import { Pinecone } from "@pinecone-database/pinecone";
import slugify from "slugify";

export const config = {
  api:{
    bodyParser: false, // Disabling the builtin middleware for parsing bodies
  }
}

// export default async function handler(req, res) {
//   // 1 only post method is allowed
//   if (req.method != "POST") {
//     return res.status(400).json({ message: "method is not allowed" });
//   }

//   try {
//     // 2 connect mongoDB
//     await connectDB();

//     // 3 parse the incoming file
//     const form = formidable({});
//     form.parse(req, async (error, fields, files) => {
//       if (error) {
//         console.log("failed to parse data");
//         return res.status(500).json({ message: error });
//       }
//       const file = files.file;
//       // console.log(file);
//       // console.log(file[0].filepath);
//       if (!file) {
//         res.status(400).json({ message: "No file uploaded" });
//       }
//       //4 upload the file to aws
//       let data;
//       try {
//         data = await s3Upload(process.env.S3_BUCKET, file);
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Failed to upload file to S3" });
//       }
      

//       const filenameWithoutExt = file[0].originalFilename.split(".")[0];
//       const filenameSlug = slugify(filenameWithoutExt, {
//         lower: true,
//         strict: true,
//       });
//       // console.log(filenameSlug);
//       // console.log("data",data);
//       // console.log("file",file);
//       //5 initialise pinecone
//       const pc = new Pinecone({
//         apiKey: process.env.PDB_KEY,
//       });
//       const PineconeRes = await pc.listIndexes();
//       if (PineconeRes) {
//         console.log("pinecone Initialised");
//       }

//       // save file in mongo db
//       const myFile = new MyFileModel({
//         fileName: file[0].originalFilename,
//         fileUrl: `https://doctalker.s3.ap-south-1.amazonaws.com/${file[0].originalFilename}`,
//         vectorNamespace: filenameSlug,
//       });

      
//       try {
//         await myFile.save();
//         res.status(200).json({ message: "File uploaded" });
//       } catch (err) {
//         if (err.code === 11000) {
//           return res
//             .status(400)
//             .json({ message: "File with the same name already exists" });
//         }
//         // Send generic error response
//         res.status(500).json({ error: err.message });
      
//       }

      
      
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error });
//   }
// }
export default async function handler(req, res) {
  // Only POST method is allowed
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Method not allowed" });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the incoming file
    const form = formidable({});
    form.parse(req, async (error, fields, files) => {
      if (error) {
        console.error("Failed to parse data:", error);
        return res.status(500).json({ message: "Failed to parse data" });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload the file to AWS S3
      let data;
      try {
        data = await s3Upload(process.env.S3_BUCKET, file);
      } catch (error) {
        console.error("Failed to upload file to S3:", error);
        return res.status(500).json({ message: "Failed to upload file to S3" });
      }

      // Initialise Pinecone
      const pc = new Pinecone({
        apiKey: process.env.PDB_KEY,
      });

      // Save file in MongoDB
      const filenameWithoutExt = file[0].originalFilename.split(".")[0];
      const filenameSlug = slugify(filenameWithoutExt, {
        lower: true,
        strict: true,
      });
      const myFile = new MyFileModel({
        fileName: file[0].originalFilename,
        fileUrl: `https://doctalker.s3.ap-south-1.amazonaws.com/${file[0].originalFilename}`,
        vectorNamespace: filenameSlug,
      });
      console.log(myFile);
      try {
        await myFile.save();
        return res.status(200).json({ message: "File uploaded,go ahead & select it.", id: myFile._id });
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(400).json({ message: "File with the same name already exists" });
        }
        return res.status(500).json({ message: err });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
