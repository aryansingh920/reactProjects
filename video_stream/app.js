const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 8080;
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");  
});

app.get("/video",(req,res)=>{
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Bad Request");
    }

    const videoPath = path.join(__dirname, "a1.mp4");
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