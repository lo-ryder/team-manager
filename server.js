const express = require('express'); //loads the express module
const bodyParser = require('body-parser'); //loads body parser module
const port = process.env.PORT || 8000; //if theres a port (we are in production use that) if undefinied port is 8000
const app = express(); //invoke express and store the resulting application into the var app
const path = require('path');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


mongoose.connect('mongodb://localhost/teamManager-app');
var connection = mongoose.connect('mongodb://localhost/teamManager-app');
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => console.log('Listening to the DB'));
autoIncrement.initialize(connection);
const { Schema } = mongoose; //destructuring
const playerSchema = new Schema({
    _id: { type: Number, ref: '_id' },
    Name: String,
    Position: String,
    GameStatus: {
      1: {
          type: String,
          default: 'Undecided'
      },
      2: {
        type: String,
        default: 'Undecided'
        },
      3: {
        type: String,
        default: 'Undecided'
        },
    }
}, {
  timestamps: true
});
playerSchema.plugin(autoIncrement.plugin, { model: 'playerSchema', field: '_id' });
const Player = mongoose.model('Player', playerSchema);

app.use(express.static(path.join(__dirname + '/manager-app/dist'))); //serves things automatically
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));

app.get('/playerslist', function(request, response){
    console.log('IN GET ROUTE');
    Player.find({})
    .then(players => response.json(players))
    .catch(error => console.log(error));
});
app.delete('/players/list/:id', function(request, response){
    let id = request.params.id;
    console.log('deleting');
    Player.remove({_id: id})
    .then(players => response.json(players))
    .catch(error => console.log(error));
});

app.post('/players/addplayer', function(request, response) {
    console.log('IN POST ROUTE');
    console.log(request.body);
    Player.create({
        Name: request.body.Name,
        Position: request.body.Position,
    })
    .then(players => response.json(players))
    .catch(error => console.log(error));
});
app.post('/statusgame/:id', function(request, response) {
    console.log(request.body);
    Player.findByIdAndUpdate({_id: request.body._id}, request.body)
    .then(notes => response.json(notes))
    .catch(error => console.log(error));
});
app.all("*", (request, response) => { response.sendFile(path.resolve("./manager-app/dist/index.html")) });
app.listen(port, () => console.log(`listening on port ${ port }`));
