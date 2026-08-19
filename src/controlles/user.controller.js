import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser =asyncHandler(async (req,res)=>{
    //  step 1: to get send data from frontend (using postman)
    // step 2:valiation not empty
    // step 3:check if user already exists:username,email
    // step 4:check for images check for avatar
    // step 5:upload them to cloudinary
    // step 6:create user object-create entry in db
    // step 7:remove password and refresh token field from response
    // step 8:check for user creation
    // step 9:return response(res)

    const {fullname,email,username,password}=req.body
    console.log("email:",email);
    if(
        [fullname,email,username,password].some((field)=> 
        field?.trim() === "" )
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverimageLocalPath=req.files?.coverimage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverimage=await uploadOnCloudinary(coverimageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar file is required")
    }

    const user = await  User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createduser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500,"something went wrong while registering the token")
    }

    return res.status(201).json(
        new ApiResponse(200,createduser,"User Registred successfully")
    )

})

export {registerUser}