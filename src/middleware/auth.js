
import jwt from "jsonwebtoken";

const authentication = (req, res,next)=>{

    try {
        let getCookie = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");

        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized User", status : 401});
            return;
        }

        let verifyToken = jwt.verify(getCookie,process.env.SECRET_KEY);

        req.id = verifyToken.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};

export default authentication;