import {v2 as cloudinary} from 'cloudinary' 
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
})

const uploadOnCludinary = async function(localFilePath) {
    try {
        if(!localFilePath) return null;
        // upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: 'auto'
         });
        // console.log("File uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);  // remove file which was locally saved
        return null;
    }
}

const deleteFromCloudinary = async function(imageURL) {
    const publicId = (imageURL) => imageURL.split('/').pop().split('.')[0];
   return await cloudinary.uploader.destroy(publicId(imageURL));
}
export {uploadOnCludinary, deleteFromCloudinary}