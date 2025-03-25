
// const dataParser = require("datauri/parser.js");

import DataParser from "datauri/parser.js";
import path from "path";

function getDataUrl(file)
{
    let parser = new DataParser();
    let fileExtensionName = path.extname(file.originalname).toString();
    return parser.format(fileExtensionName,file.buffer).content;
}

export default getDataUrl;