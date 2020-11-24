const { json } = require('body-parser');

const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      Movie = require('./model/movie'),
      imageMineTypes = ['image/jpeg', 'image/png', 'images/gif']
      bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/file_pond' ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("CONNECTED TO DATABASE"))
.catch(err => console.log(err));


// app.use(body.urlencoded({}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.get('/',async (req, res) =>  {
    try{
        let movie = await Movie.find();
        res.render('index', {movies: movie});
    }catch(err){
        console.log(err);
    }
});
app.post('/add', async (req, res) => {
    let {name, type, img} = req.body;
    let movie = new Movie({
        name,
        type
    });
    saveImage(movie, img);
    try{
        const newMovie = await movie.save();
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
    console.log(movie)
});


// save image as binary
function saveImage(movie, imgEncoded){
    if(imgEncoded == null) return;
    let img = JSON.parse(imgEncoded);

    if(img != null && imageMineTypes.includes(img.type)){
        movie.img = new Buffer.from(img.data, 'base64');
        movie.imgType = img.type;
    }
}


app.listen(3000, () => console.log('Server is started'));