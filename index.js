const express = require('express');
const app = express();
const ejs = require('ejs');
const request = require('request');
const fs = require('fs');


const PORT = 3000;
const ig = require('instagram-scraping');

//download directory
let download_directory = './public/downloads/';

//static path
app.use(express.static(__dirname + '/public'));

//ejs
app.set('view engine', 'ejs');

//json parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/scrape',(req,res)=>{
    var username = req.query.username;
    if(username.length < 1 ){
        res.redirect('/');
    }
    ig.scrapeUserPage(username).then(result => {
        let data = [];
        result.medias.forEach(scrapeData => {
            if(!scrapeData){
                res.redirect('/');
            }
            data.push({
                "image_url":scrapeData.display_url,
                "description":scrapeData.text,
                "comment_count":scrapeData.comment_count,
                "like_count":scrapeData.like_count
            })
        });
        res.render('main', {data});
      });
});

app.get('/download', async (req,res)=>{
    var image_url = req.query.image;
    var image_name = Date.now();
    var file_directory = download_directory.concat(image_name);
    var stream = await request(image_url).pipe(fs.createWriteStream(`${file_directory}.jpeg`));
    stream.on('finish', ()=>{
        res.download(`public/downloads/${image_name}.jpeg`);
        console.log(`${file_directory}.jpeg`);
    });
});


app.listen(PORT,()=>console.log(`server started at ${PORT}`));

