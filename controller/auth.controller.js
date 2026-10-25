import bcrypt from 'bcrypt'
import User from "../model/auth.model.js"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) =>{
    try{
        const {name, email, password, domain, skills} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        if(password.length < 8){
            res.status(400).json({
                success : false,
                message : "Password must be at least 8 characters long"
            })
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            domain,
            skills
        })
        return res.status(201).json({
            success : true,
            message : "User created",
            user
        })
    }
    catch (e){
        console.error(e)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}
export default registerUser
export const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Invalidpassword"
            })
        }
        const token = jwt.sign({id : user._id}, process.env.JWD_SECRET)
        return res.status(200).json({
            success : true,
            message : "Login successful",
            user,
            token
        })
    }
    catch (e){
        console.log(e.message)
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}