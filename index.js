const express = require('express');
const cors = require('cors');
const monk = require('monk');
require('dotenv/config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./client'));

const db = monk(process.env.DB_CONNECTION || 'localhost/meower');
const tweets = db.get('tweets');
const port = process.env.PORT || 8000;

app.listen(port, ()=> {
    console.log(`listening on ${port}`);
});

function isValidTweet(tweet){
    return tweet.name && tweet.name.toString().trim() !== '' &&
    tweet.content && tweet.content.toString().trim() !== '';
}

app.get('/tweet', (req, res) => {
    tweets.find().then(tweets => {
        tweets.reverse();
        res.json(tweets);
    });
});

app.post('/tweet', (req, res) => {
    if (isValidTweet(req.body)){
        const tweet_content = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };
        
        tweets.insert(tweet_content).then(createdTweet =>{
            console.log("sth");
            res.json(createdTweet);
        });

    } else {
        res.status(422);
        res.json({
            message: "Name and content required"
        });
    }
    console.log("DONE");
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world!'
    })
});
