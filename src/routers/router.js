const express = require('express')
const sql = require('mssql')
const config = require('../models/sqlSetup')
const moment = require('moment')
const app = new express.Router()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.get('/country', async (req, res) => {
    await sql.connect(config, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var dateGiven=req.query.date
            if(dateGiven==null){
                dateGiven='2020-07-06'  //moment().format('YYYY-MM-DD')
            }
            var countryName=req.query.countryName
            if(countryName==null){
                countryName='canada'
            }
            const countryData = new sql.Request()
            countryData.query(`select c.Name,cc.TotalConfirmed,cc.TotalRecovered,cc.TotalDeath,cc.ActiveCases,cc.TotalTests,cc.Population,cc.Source,cc.DateTime from covid_cases cc,country c, Country_Cases coc where cc.ID=coc.Covid_CaseId and coc.CountryCode=c.ID and c.Name='${countryName}' and cc.DateTime='${dateGiven}'`, (error, result) => {
                if (error) {
                    res.status(400).send(`Error from request two  :${error}`)
                }
                else {
                    res.send(result.recordset)
                }
            })
        }
    })
})

app.get('/allprovinces',async(req,res)=>{
    await sql.connect(config, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var dateGiven=req.query.date
            if(dateGiven==null){
                dateGiven='2020-07-06'  //moment().format('YYYY-MM-DD')
            }
            const provinceData = new sql.Request()
            provinceData.query(`select p.Name, cc.TotalConfirmed,cc.TotalRecovered,cc.TotalDeath,cc.ActiveCases,cc.TotalTests,cc.Population,cc.Source from Province p, COVID_CASES cc, Province_Cases pc where pc.Covid_CaseId=cc.ID and pc.ProvinceCode=p.ID and cc.DateTime='${dateGiven}'`, (error, result) => {
                if (error) {
                    res.status(400).send(`Error from requesttwo  :${error}`)
                }
                else {
                    res.send(result.recordset)
                }
            })
        }
    })
})

app.get('/province',async(req,res)=>{
    await sql.connect(config, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var dateGiven=req.query.date
            const provinceName=req.query.provinceName
            if(dateGiven==null){
                dateGiven='2020-07-06'  //moment().format('YYYY-MM-DD')
            }
            const provinceData = new sql.Request()
            provinceData.query(`select p.Name, cc.TotalConfirmed,cc.TotalRecovered,cc.TotalDeath,cc.ActiveCases,cc.TotalTests,cc.Population,cc.Source from Province p, COVID_CASES cc, Province_Cases pc where pc.Covid_CaseId=cc.ID and pc.ProvinceCode=p.ID and cc.DateTime='${dateGiven}' and p.Name='${provinceName}'`, (error, result) => {
                if (error) {
                    res.status(400).send(`Error from requesttwo  :${error}`)
                }
                else {
                    res.send(result.recordset)
                }
            })
        }
    })
})

app.get('/allregions',async (req,res)=>{
    await sql.connect(config, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var dateGiven=req.query.date
            if(dateGiven==null){
                dateGiven='2020-07-06'  //moment().format('YYYY-MM-DD')
            }
            const regionalData = new sql.Request()
            regionalData.query(`select r.Name, cc.TotalConfirmed,cc.TotalRecovered,cc.TotalDeath,cc.ActiveCases,cc.TotalTests,cc.Population,cc.Source, cc.DateTime from Region r,COVID_CASES cc, Region_Cases rc where rc.Covid_CaseId=cc.ID and rc.RegionCode=r.ID and cc.DateTime='${dateGiven}'`, (error, result) => {
                if (error) {
                    res.status(400).send(`Error from requesttwo  :${error}`)
                }
                else {
                    res.send(result.recordset)
                }
            })
        }
    })
})

app.get('/region',async(req,res)=>{
    await sql.connect(config, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var dateGiven=req.query.date
            const regionName=req.query.regionName
            if(dateGiven==null){
                dateGiven='2020-07-06'  //moment().format('YYYY-MM-DD')
            }
            const regionData = new sql.Request()
            regionData.query(`select r.Name, cc.TotalConfirmed,cc.TotalRecovered,cc.TotalDeath,cc.ActiveCases,cc.TotalTests,cc.Population,cc.Source, cc.DateTime from Region r,COVID_CASES cc, Region_Cases rc where rc.Covid_CaseId=cc.ID and rc.RegionCode=r.ID and cc.DateTime='${dateGiven}' and r.Name='${regionName}'`, (error, result) => {
                if (error) {
                    res.status(400).send(`Error from requesttwo  :${error}`)
                }
                else {
                    res.send(result.recordset)
                }
            })
        }
    })
})
module.exports = app