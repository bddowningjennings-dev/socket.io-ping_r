const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static(__dirname + '/build'))

const server = app.listen(8000, ()=>console.log(`listening on port 8000...`))
require('./server/config/socket.io')(server)
require('./server/config/routes')(app)

