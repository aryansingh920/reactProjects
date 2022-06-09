const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 8080;
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");  
});

app.get("/video",(req,res)=>{
    const vid = "https://res.cloudinary.com/zigy/video/upload/v1654788022/a1_tyjsig.mp4"
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Bad Request");
    }

    const videoPath = path.join(vid);
    const videoSize = fs.statSync(videoPath).size;
    const chunkSize = 10**6;  
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + chunkSize, videoSize-1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);

})


app.get("/video1",(req,res)=>{
    const vid = "a1.mp4";
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Bad Request");
    }

    const videoPath = path.join(__dirname, vid);
    const videoSize = fs.statSync(videoPath).size;
    const chunkSize = 10**6;  
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + chunkSize, videoSize-1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);

})


app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})