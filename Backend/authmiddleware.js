const jwt = require('jsonwebtoken');
// authmiddleware which will protect the routes allowing auhorized access after authentication only 
const authmiddleware = (req , res , next) => {

const token = req.headers['authorization']?.split(' ')[1];


    if(!token) {
        return res.status(403).json({message : "No token provided"});

    }

    try  {  
        
        
    jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {
        console.log("hit")
        if(err) {
            return res.status(401).json({message :  "Unauthorized access"}) ;
        }
        req.userId =  decoded.userId ;
        next() ;

    
    }) ;
}catch (error) {
    console.error('Invalid token:', err); 

    next();
  }

}



module.exports = authmiddleware;