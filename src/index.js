import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import connectdb from "./db/index.js"
import {app} from "./app.js"
dotenv.config({
    path: './.env'
})

connectdb()
.then(()=>{
    app.listen(process.env.PORT || 8000,() => {
        console.log(`server is running at port: ${process.env.PORT}`)
    });
})
.catch((err)=>{
    console.log("MONGODB CONNECTION FAILED !!!",err);
})
