const cheerio = require('cheerio')
const axios = require('axios')
const sql=require('mssql/msnodesqlv8');
const { DateTime, pool } = require('mssql/msnodesqlv8');
const moment=require('moment')

const config = {
    user: process.env.user,
    password: process.env.password,
    driver: 'msnodesqlv8',
    server: 'localhost',
    database: "Covid19Test",
    options: { "enableArithAbort": true, trustedConnection: true }
};

// create pool

const poolPromise =new sql.ConnectionPool(config)
    .connect()
    .then(pool=>{
        console.log('Connected to DB')
        return pool
    })
    .catch(error=>console.log('Database Connection failed'))



var publicHealthUnit = [];
var cases = [];
var casesPerMillion = [];
var Recovered = [];
var Deaths = [];
var deathsPerMillion = [];

var G_outputCovidCasesID, G_outputRegionID;

const asyncCall = async ()=>
{

    await axios.get('https://en.wikipedia.org/w/index.php?title=COVID-19_pandemic_in_Ontario').then((response) => 
    {
    // Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)

        const regionCases = $('table.wikitable.sortable tbody').first().find('tr').each( (index, element) => {

            publicHealthUnit.push($($(element).find('td')[0]).text().trim().replace(',',''));
            cases.push($($(element).find('td')[1]).text().trim().replace(',',''));
            casesPerMillion.push($($(element).find('td')[2]).text().trim().replace(',',''));
            Recovered.push($($(element).find('td')[3]).text().trim().replace(',',''));
            Deaths.push($($(element).find('td')[4]).text().trim().replace(',',''));
            deathsPerMillion.push($($(element).find('td')[5]).text().trim().replace(',',''));

        });

        publicHealthUnit.shift();
        cases.shift();
        casesPerMillion.shift();
        Recovered.shift();
        Deaths.shift();
        deathsPerMillion.shift();
    });



    publicHealthUnit.forEach(async function(healthUnit, index)
    {


        const pool = await poolPromise;

        
        let active = Number(cases[index])-(Number(Recovered[index])+Number(Deaths[index]));
        
        var covidCasesInput = "insert into COVID_CASES (TotalConfirmed, TotalRecovered, TotalDeath, ActiveCases,Source,DateTime) OUTPUT inserted.ID VALUES( @TotalConfirmed, @TotalRecovered, @TotalDeath, @ActiveCases, @Source,@DateTime)";       
        const resultCovidCases = await pool.request().input('TotalConfirmed', Number(cases[index]))
        .input('TotalRecovered', Number(Recovered[index]))
        .input('TotalDeath', Number(Deaths[index]))
        .input('ActiveCases', Number(active))
        .input('DateTime',String(moment().format('YYYY-MM-DD')))
        .input('Source',"Wikipedia").query(covidCasesInput,async function (err, outputCovidCases) 
        {
            
            if (err) console.log(err);

            G_outputCovidCasesID = outputCovidCases.recordset[0].ID;
            var regionIDSelect = "select ID from Region where Name = @RegionName";
            const resultRegionID =await pool.request()
            .input('RegionName', String(healthUnit))
            .query(regionIDSelect, async function (err, outputRegionID) 
            {
              
                if (err) console.log(err);
                if(outputRegionID.rowsAffected.length==0)
                {
                    console.log('In region cases insert')
                    G_outputRegionID = outputRegionID.recordset[0].ID;
                    console.log(G_outputRegionID)
                    console.log(G_outputCovidCasesID)
                    var regionCasesInput = "insert into Region_Cases (Covid_CaseId, RegionCode) VALUES( @Covid_CaseId, @RegionCode)";
                    const resultRegionCases = pool.request()
                    .input('Covid_CaseId', G_outputCovidCasesID)
                    .input('RegionCode', G_outputRegionID)
                    .query(regionCasesInput, function (err, outputRegionCases) 
                    {
                    
                        if (err) console.log(err);

                    });

                }
                else
                {
                    console.log('inserting regions')
                    var regionInsert = "insert into Region (Name, ProvinceId) OUTPUT inserted.ID VALUES( @RegionName, @ProvinceId)";
                    const resultRegion = pool.request()
                    .input('RegionName', String(healthUnit))
                    .input('ProvinceId', 1)
                    .query(regionInsert, function (err, outputRegion) 
                    {
                        
                        if (err) console.log(err);
                        if(outputRegion.rowsAffected == 1)
                        {
                            G_outputRegionID = outputRegion.recordset[0].ID;

                            var regionCasesInput = "insert into Region_Cases (Covid_CaseId, RegionCode) VALUES( @Covid_CaseId, @RegionCode)";
                            const resultRegionCases = pool.request()
                            .input('Covid_CaseId', G_outputCovidCasesID)
                            .input('RegionCode', G_outputRegionID)
                            .query(regionCasesInput, function (err, outputRegionCases) 
                            {
                                
                                if (err) console.log(err);

                                
                            });
                        }
                    });
                }

            
            }); 
        
        });
    

    });
}

asyncCall();