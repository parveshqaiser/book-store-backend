
// const cloudServer = require("cloudinary");
import cloudServer from "cloudinary";

cloudServer.v2.config({
    cloud_name :process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_SECRET_KEY
});

export default cloudServer;