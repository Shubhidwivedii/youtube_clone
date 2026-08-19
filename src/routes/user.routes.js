import { Router } from "express";
import { registerUser } from "../controlles/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router=Router()
// http:localhost:8000/users/register
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },{
            name:"coverimage",
            maxcount:1
        }
    ]),
    registerUser
)


export default router
// thunder client