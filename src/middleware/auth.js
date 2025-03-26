
import jwt from "jsonwebtoken";

const authentication = (req, res,next)=>{

    try {
        let getCookie = req.cookies?.token;
        
        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized User", status : 401});
            return;
        }

        let verifyToken = jwt.verify(getCookie, "secret-key");

        req.id = verifyToken.id;
        next();
    } catch (error) {
        console.log("error in authentication", error);
        res.status(500).json({message : "error in authentication", success: false});
    }
};

export default authentication;