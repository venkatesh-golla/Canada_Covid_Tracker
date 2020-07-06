const express = require('express')
const path = require('path')
const routers= require('./routers/router') 

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(routers)


app.listen(port, () => {
    console.log('Server is up on port 3000')
})
