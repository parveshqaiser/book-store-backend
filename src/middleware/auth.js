
import jwt from "jsonwebtoken";

const authentication = (req, res,next)=>{

    try {
        let getCookie = req.cookies?.accessToken;
        
        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized User", status : 401});
            return;
        }

        let verifyToken = jwt.verify(getCookie,process.env.SECRET_KEY);

        req.id = verifyToken.id;
        next();
    } catch (error) {
        console.log("error in authentication", error.message);
        res.status(401).json({message : "Error in Authentication", success: false , status : 401});
        // res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

export default authentication;