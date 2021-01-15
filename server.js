require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
//always place helmet before cors in the pipeline
const cors = require('cors')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES;

    //filter movie by genre if genre query param is present
    if (req.query.genre) {
        response = response.filter(movie =>
            
            movie.genre
                .toLowerCase()
                .includes(req.query.genre.toLowerCase())
        )
    }

    // filter by country if param is present
    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    // filter by query avg_vote if param and number requested
    if (req.query.avg_vote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})