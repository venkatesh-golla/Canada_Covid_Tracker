const express = require('express')
const { config, sql, poolPromise } = require("../models/sqlSetup")
const moment = require('moment')
const locationName = require('../utils/location')
const validator = require('validator')
const query = require('../models/queries.json')
const Nexmo = require('nexmo')
const app = new express.Router()


app.get('/country', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')
        }
        var countryName = req.query.countryName
        if (countryName == null) {
            countryName = 'canada'
        }
        const countryData = await pool.request()
            .input('countryName', sql.VarChar, countryName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.getCountryData)
        res.send(JSON.stringify(countryData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }

})

app.get('/countryGraph', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        const countryName = 'Canada'
        if (countryName == null) {
            throw new Error(`Error: Country Name is required`)
        }
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')
        }
        const countryData = await pool.request()
            .input('countryName', sql.VarChar, countryName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.countryGraph)
        //console.log(JSON.stringify(provinceData.recordset[0].split(':')))
        res.send(JSON.stringify(countryData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }

})

app.get('/allProvinces', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')
        }
        const provinceData = await pool.request()
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.allProvinces)
        res.send(JSON.stringify(provinceData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/province', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        const provinceName = req.query.provinceName
        if (provinceName == null) {
            throw new Error(`Error: ProvinceName is required`)
        }
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')
        }
        const provinceData = await pool.request()
            .input('provinceName', sql.VarChar, provinceName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.province)
        res.send(JSON.stringify(provinceData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/provinceGraph', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        const provinceName = 'Alberta'
        if (provinceName == null) {
            throw new Error(`Error: ProvinceName is required`)
        }
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')
        }
        const provinceData = await pool.request()
            .input('provinceName', sql.VarChar, provinceName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.provinceGraph)

        //console.log(JSON.stringify(provinceData.recordset[0].split(':')))
        res.send(JSON.stringify(provinceData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }

})

app.get('/allRegions', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        if (dateGiven == null) {
            dateGiven =  moment().format('YYYY-MM-DD')
        }
        const regionalData = await pool.request()
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.allRegions)
        res.send(JSON.stringify(regionalData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/region', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        const regionName = req.query.regionName
        if (regionName == null) {
            throw new Error('Error: Region name is required')
        }
        if (dateGiven == null) {
            dateGiven = moment().format('YYYY-MM-DD')  
        }
        
        const regionData = await pool.request()
            .input('regionName', sql.VarChar, regionName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.region)
        res.send(JSON.stringify(regionData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/regionGraph', async (req, res) => {
    try {
        const pool = await poolPromise
        var dateGiven = req.query.date
        const regionName = req.query.regionName
        if (regionName == null) {
            throw new Error('Error: Region name is required')
        }
        if (dateGiven == null) {
            dateGiven =moment().format('YYYY-MM-DD')
        }
        const regionData = await pool.request()
            .input('regionName', sql.VarChar, regionName)
            .input('dateGiven', sql.VarChar, dateGiven)
            .query(query.regionGraph)
        res.send(JSON.stringify(regionData.recordset))
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/feedback', async (req, res) => {
    try {
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const emailId = req.body.emailId
        const comments = req.body.comments
        const country = req.body.country
        if (firstName != null && lastName != null && emailId != null && comments != null) {
            if (!validator.isEmail(emailId)) {
                res.send(JSON.stringify({'Error':'Please check your email'}))
            }
            const pool = await poolPromise
            const feedback = await pool.request()
                .input('firstName', sql.VarChar, firstName)
                .input('lastName', sql.VarChar, lastName)
                .input('country', sql.VarChar, country)
                .input('email', sql.VarChar, emailId)
                .input('comments', sql.VarBinary, comments)
                .query(query.feedbackInput)
            res.send(JSON.stringify(feedback))
        } else {
            return new Error('Error : Please enter all the fields')
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/location', (req, res) => {
    const latitude = req.query.latitude
    const longitude = req.query.longitude
    if (!(latitude && longitude)) {
        return res.send({
            error: 'Unable to find your location'
        })
    }
    locationName(latitude, longitude, (error, locationData) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        res.send({ data: locationData })
    })
})

app.get('/regionNames', async (req, res) => {
    const pool = await poolPromise
    const regionNames = await pool.request()
        .query(query.regionNames)
    res.send(JSON.stringify(regionNames))
})

app.get('/provinceNames', async (req, res) => {
    const pool = await poolPromise
    const provinceNames = await pool.request()
        .query(query.provinceNames)
    res.send(JSON.stringify(provinceNames))
})

const nexmo = new Nexmo({
    apiKey: 'c6d88d7d',
    apiSecret: 'JbfSR3MQAfYgRM29',
}, { debug: true })


module.exports = app