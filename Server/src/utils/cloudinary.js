import {v2 as cloudinary} from 'cloudinary' 
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
})

const uploadOnCludinary = async function(localFilePath) {
    try {
        if (!localFilePath) return null;

        // Upload on Cloudinary using upload_large for large files
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            // chunk_size: 6000000 // Adjust chunk size if needed
        });
        
        // Log the uploaded file URL
        console.log("File uploaded on Cloudinary", response.url);

        // Remove the local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Remove the local file in case of an error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(error);
        return null;
    }
};

const uploadVideoOnCludinary = async function(localFilePath) {
    try {
        if (!localFilePath) return null;

        // Upload on Cloudinary using upload_large for large files
        const response = await cloudinary.uploader.upload_large(localFilePath, {
            resource_type: 'video',
            chunk_size: 6000000 // Adjust chunk size if needed
        });
        
        // Log the uploaded file URL
        console.log("File uploaded on Cloudinary", response.url);

        // Remove the local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Remove the local file in case of an error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(error);
        return null;
    }
};

const deleteFromCloudinary = async function(imageURL) {
    const publicId = (imageURL) => imageURL.split('/').pop().split('.')[0];
   return await cloudinary.uploader.destroy(publicId(imageURL));
}
export {uploadOnCludinary,uploadVideoOnCludinary, deleteFromCloudinary}