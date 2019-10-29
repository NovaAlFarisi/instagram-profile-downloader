const express = require('express');
const app = express();
const ejs = require('ejs');

const PORT = 3000;
const ig = require('instagram-scraping');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/',(req,res)=>{
    ig.scrapeUserPage(req.query.username).then(result => {
        res.json(result);
      });
});

app.get('/scrape',(req,res)=>{
    ig.scrapeUserPage(req.query.username).then(result => {
        let data = [];
        result.medias.forEach(scrapeData => {
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

app.get('/download', (req,res)=>{
    var image_url = req.query.image;
    res.download(image_url);
});


app.listen(PORT,()=>console.log(`server started at ${PORT}`));

