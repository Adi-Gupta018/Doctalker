import AWS from 'aws-sdk'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_ID,
//     secretAccessKey: process.env.AWS_ACCESS_KEY,
//     region:'ap-south-1',
// });

const client = new S3Client({
    credentials:{
        accessKeyId : process.env.AWS_ACCESS_KEY_ID ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "ap-south-1",  // Region of your bucket

})

export const s3Upload = async(bucket,file) =>{
    const command = new PutObjectCommand({
        Bucket : bucket ,
        Key:file[0].originalFilename,
        Body:fs.createReadStream(file[0].filepath)
    })

    return await client.send(command);  //.promise so that await can be used
}

export const s3delete = async(bucket,key)=>{
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key:key,
    })

    return await client.send(command);
}