import userModel from '../../models/userModel.js';
import bcrypt from 'bcryptjs';


async function userSignUpController(req,res){
    try{
        const { email, password, name } = req.body        

        const user = await userModel.findOne({email})        

        if(user){
            throw new Error("User already exists")
        }

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
            throw new Error("Please provide password")
        }
        if(!name){
            throw new Error("Please provide name")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if(!hashPassword){
            throw new Error("something is wrong")
        }

        const payload = {
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()
        
        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "User created Succesfully!"
        })


    }catch(err){         
        res.json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}


export default userSignUpController