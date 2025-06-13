import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const authenToken = async ( req , res , next) =>{
    try {
        const authorized = req.headers['authorization'];
        if(!authorized && !authorized.startsWith('Bearer'))
            return res.status(401).json({error : "Thhere is a Something Went Wrong in the header."})
        const token = authorized.split(' ')[1]
        const payload = jwt.verify(token,process.env.SECRET_KEY)

        const user = await User.findById(payload.userId)
        if(!user)
            return res.status(401).json({Error: 'User Not found'})
    
        req.user=user
        next()
    } catch (error) {
        console.log('Auth Error',error);
        return res.status(401).json({error:"Invalid User or Token"})
    }
}

export const isAdmin= (req,res,next)=>{
    if(!req.user)
        return res.status(500).json({error:'Req not setted check it.'})
    if(req.uer.role !=='admin'){
        return res.status(401).json({error:'Admin Privilage required.'})
    }
    next();
}