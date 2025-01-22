
import jwt from "jsonwebtoken";

const authentication = (req, res,next)=>{

    try {
        let getCookie = req.cookies?.token;
        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized User"});
            return;
        }

        let verifyToken = jwt.verify(getCookie, "secret-key");

        req.id = verifyToken.id;
        next();
    } catch (error) {
        console.log("error in authentication")
    }
};

export default authentication;