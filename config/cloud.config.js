//cloudinary should be here because 3rd part websites are stored here
import {v2 as cloudinary} from "cloudinary"//version2 peovieds additional features
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

export default cloudinary

