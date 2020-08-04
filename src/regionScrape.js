//const sql = require("mssql");
const cheerio = require('cheerio')
const axios = require('axios')
const sql = require("mssql/msnodesqlv8");
const moment=require("moment")

//config for your database
const config = {
    user: process.env.user,
    password: process.env.password,
    driver: 'msnodesqlv8',
    server: 'localhost',
    database: "Covid19Test",
    options: { "enableArithAbort": true, trustedConnection: true }
};
//Creation of Connection Pool
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to DB')
        return pool
    })
    .catch(error => console.log('Database Connection failed'))

var publicHealthUnit = [];
var cases = [];
var casesPerMillion = [];
var Recovered = [];
var Deaths = [];
var deathsPerMillion = [];

const scrappingOntario = async () => {
    await axios.get('https://en.wikipedia.org/w/index.php?title=COVID-19_pandemic_in_Ontario').then(async (response) => {
        console.log('start of scrapping')
        // Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)

        const regionCases = await $('table.wikitable.sortable tbody').first().find('tr').each((index, element) => {

            publicHealthUnit.push($($(element).find('td')[0]).text().trim().replace(',', ''));
            cases.push($($(element).find('td')[1]).text().trim().replace(',', ''));
            casesPerMillion.push($($(element).find('td')[2]).text().trim().replace(',', ''));
            Recovered.push($($(element).find('td')[3]).text().trim().replace(',', ''));
            Deaths.push($($(element).find('td')[4]).text().trim().replace(',', ''));
            deathsPerMillion.push($($(element).find('td')[5]).text().trim().replace(',', ''));

        });
        publicHealthUnit.shift();
        cases.shift();
        casesPerMillion.shift();
        Recovered.shift();
        Deaths.shift();
        deathsPerMillion.shift();
    });
    const pool = await poolPromise
    const doesRegionExist = await pool.request()
        .input('ProvinceId', sql.Numeric, 1)
        .query('select * from region where ProvinceId=@ProvinceId', (err, response) => {
            if (response.recordset.length == 0) {
                insertRegions()
            }
        })
        insertCases()
}

scrappingOntario()
const insertRegions = async function () {
    publicHealthUnit.forEach(async (healthUnit) => {
        var regionInsert = "insert into Region (Name, ProvinceId) OUTPUT inserted.ID VALUES( @RegionName, @ProvinceId)";
        const pool = await poolPromise
        //console.log(healthUnit)
        const resultRegion = await pool.request()
            .input('RegionName', sql.VarChar, healthUnit)
            .input('ProvinceId', sql.Numeric, 1)
            .query(regionInsert, function (err, outputRegion) {

                if (err) console.log(err);
                // console.log(outputRegion)
            });
    })

}
const insertCases = async function () {
    for (var i = 0; i < publicHealthUnit.length; i++) {
        const active = Number(cases[i]) - (Number(Recovered[i]) + Number(Deaths[i]));
        var covidCasesInput = "insert into COVID_CASES (TotalConfirmed, TotalRecovered, TotalDeath, ActiveCases,Source,DateTime) OUTPUT inserted.ID VALUES( @TotalConfirmed, @TotalRecovered, @TotalDeath, @ActiveCases, @Source,@DateTime)"; 
        const pool = await poolPromise
        const insertIntoCovidCases = await pool.request().input('TotalConfirmed', Number(cases[i]))
            .input('TotalRecovered', Number(Recovered[i]))
            .input('TotalDeath', Number(Deaths[i]))
            .input('ActiveCases', Number(active))
            .input('DateTime',String(moment().format('YYYY-MM-DD')))
            .input('Source', "Wikipedia").query(covidCasesInput)
        console.log(insertIntoCovidCases.recordset[0].ID)
        const covidCaseId_RegionCase=insertIntoCovidCases.recordset[0].ID
        covidCaseId = insertIntoCovidCases.recordset[0].ID


        var regionIDSelect = "select ID from Region where Name = @RegionName";
        const regionCasesInput = await pool.request()
            .input('RegionName', sql.VarChar, publicHealthUnit[i])
            .query(regionIDSelect)


        const regionId_RegionCase=regionCasesInput.recordset[0].ID
        var regionCasesInputQuery = "insert into Region_Cases (Covid_CaseId, RegionCode) VALUES( @Covid_CaseId, @RegionCode)";
        const regionCasesInsert=await pool.request()
            .input('Covid_CaseId',sql.Numeric,covidCaseId_RegionCase)
            .input('RegionCode',sql.Numeric,regionId_RegionCase)
            .query(regionCasesInputQuery,(err,response)=>{
                if(err){
                    console.log(err)
                }
            })
    }

}