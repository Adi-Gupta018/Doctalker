import AWS from 'aws-sdk'
import { DeleteObjectCommand, PutObjectCommand, GetObjectCommand,ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    region: "us-east-005",  // Region of your bucket
    endpoint: 'https://s3.us-east-005.backblazeb2.com',

})

export const s3Upload = async(bucket,file) =>{
    const command = new PutObjectCommand({
        Bucket : bucket ,
        Key:file[0].originalFilename,
        Body:fs.createReadStream(file[0].filepath)
    })

    // listBuckets();

    return await client.send(command);  //.promise so that await can be used
}

const listBuckets = async () => {
    try {
        const command = new ListBucketsCommand({});
        const data = await client.send(command);
        console.log("Buckets: ", data.Buckets);
    } catch (error) {
        console.error("Error listing buckets: ", error);
    }
};



export const s3delete = async(bucket,key)=>{
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key:key,
    })

    return await client.send(command);
}

export const s3getfile = async(bucket,key)=>{
    const command = new GetObjectCommand({
        Bucket:bucket,
        Key:key
    });
    return await client.send(command);
}

export const s3GetSignedURL = async(bucket, filekey)=>{
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: filekey,
    });

    try {
        const signedUrl = await getSignedUrl(client, command,{expiresIn:7 * 24 * 60 * 60});
        return signedUrl;
    } catch (error) {
        console.log(error);
        throw new Error("Error generating signed url:+ ", error.message);
        
    }
} 