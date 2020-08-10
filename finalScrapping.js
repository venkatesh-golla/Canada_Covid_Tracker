const cheerio = require('cheerio')
const axios = require('axios')
const sql=require('mssql')

var config = {
  server: "localhost",
  user: "sa",
  password: "Venky123!@#",
  database: "Covid19",
  "options": {
    "encrypt": true,
    "enableArithAbort": true
    }
};

// create pool

const poolPromise =new sql.ConnectionPool(config)
    .connect()
    .then(pool=>{
        console.log('Connected to DB')
        return pool
    })
    .catch(error=>console.log('Database Connection failed'))


const countryWorld = async (callback)=>
{

    var countries = [];
    var cases = [];
    var recovered = [];
    var deaths = [];

    await axios.get('https://en.wikipedia.org/wiki/COVID-19_pandemic_by_country_and_territory#covid19-container').then((response) => 
    {
        // Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)

        const regionCases = $('table.wikitable.sortable tbody').first().find('tr').each( (index, element) => {
            
            countries.push($($(element).find('th')[1]).text().trim().replace(/\[.*?\]/gi, ''));
            cases.push($($(element).find('td')[0]).text().trim().replace(/,/g, '').replace(/No data/gi, ''));
            deaths.push($($(element).find('td')[1]).text().trim().replace(/,/g, '').replace(/No data/gi, ''));
            recovered.push($($(element).find('td')[2]).text().trim().replace(/,/g, '').replace(/No data/gi, ''));

        });

        countries.splice(0, 2);
        countries.splice(-2, 2);

        cases.splice(0, 2);
        cases.splice(-2, 2);

        deaths.splice(0, 2);
        deaths.splice(-2, 2);

        recovered.splice(0, 2);
        recovered.splice(-2, 2);

    });



    countries.forEach(async function(country, index)
    {


        const pool = await poolPromise;

        
        let active = Number(cases[index])-(Number(recovered[index])+Number(deaths[index]));
        
        var covidCasesInput = "insert into COVID_CASES (TotalConfirmed, TotalRecovered, TotalDeath, ActiveCases, Source) OUTPUT inserted.ID VALUES( @TotalConfirmed, @TotalRecovered, @TotalDeath, @ActiveCases, @Source)";       
        const resultCovidCases = await pool.request()
        .input('TotalConfirmed', Number(cases[index]))
        .input('TotalRecovered', Number(recovered[index]))
        .input('TotalDeath', Number(deaths[index]))
        .input('ActiveCases', Number(active))
        .input('Source',"Wikipedia")
        .query(covidCasesInput, function (err, outputCovidCases) 
        {
            
            if (err) console.log(err);

            (outputCovidCases.recordset).forEach(async function(covidCases, indexCovidCases)
            {
                
                
                var countryIDSelect = "select ID from Country where Name = @CountryName";
                const resultCountryID = pool.request()
                .input('CountryName', String(country))
                .query(countryIDSelect, async function (err, outputCountryID) 
                {
                
                    if (err) console.log(err);

                    if(outputCountryID.rowsAffected == 1)
                    {
                        (outputCountryID.recordset).forEach(async function(CountryID, indexCountryID)
                        {

                            var countryCasesInput = "insert into Country_Cases (Covid_CaseId, CountryCode) VALUES( @Covid_CaseId, @CountryCode)";
                            const resultRegionCases = pool.request()
                            .input('Covid_CaseId', covidCases.ID)
                            .input('CountryCode', CountryID.ID)
                            .query(countryCasesInput, function (err, outputCountryCases) 
                            {
                            
                                if (err) console.log(err);
                                
                            });


                        });
                        
                    }
                    else
                    {

                        var countryInsert = "insert into Country (Name) OUTPUT inserted.ID values(@CountryName)";

                        const resultCountry = pool.request()
                        .input('CountryName', String(country))
                        .query(countryInsert, function (err, outputCountry) 
                        {
                            
                            if (err) console.log(err);

                            
                            if(outputCountry.rowsAffected == 1)
                            {
                                (outputCountry.recordset).forEach(async function(Country_Name, indexCountry)
                                {

                                    var countryCasesInput = "insert into Country_Cases (Covid_CaseId, CountryCode) VALUES( @Covid_CaseId, @CountryCode)";
                                    const resultCountryCases = pool.request()
                                    .input('Covid_CaseId', covidCases.ID)
                                    .input('CountryCode', Country_Name.ID)
                                    .query(countryCasesInput, function (err, outputCountryCases) 
                                    {
                                        
                                        if (err) console.log(err);
                                    
                                    });

                                });

                                
                            }
                        });
                    }

                
                }); 


            });
            
        
        });
    

    });
    callback.apply(this,[]);
        
}


const provinceCanada = async (callback)=>
{

    var provinces = [];
    var population = [];
    var tests = [];
    var cases = [];
    var casesPerMillion = [];
    var recovered = [];
    var deaths = [];
    var active = [];

    await axios.get('https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Canada').then((response) => 
    {
        // Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)

        const regionCases = $('table.wikitable.sortable tbody').first().find('tr').each( (index, element) => {
            
            provinces.push($($(element).find('td')[0]).text().trim().replace(/,/g, ''));
            population.push($($(element).find('td')[1]).text().trim().replace(/,/g, ''));
            tests.push($($(element).find('td')[2]).text().trim().replace(/,/g, ''));
            cases.push($($(element).find('td')[4]).text().trim().replace(/,/g, ''));
            casesPerMillion.push($($(element).find('td')[5]).text().trim().replace(/,/g, ''));
            recovered.push($($(element).find('td')[6]).text().trim().replace(/,/g, ''));
            deaths.push($($(element).find('td')[7]).text().trim().replace(/,/g, ''));
            active.push($($(element).find('td')[9]).text().trim().replace(/,/g, ''));

        });

        provinces.splice(0, 2);
        provinces.splice(-2, 2);

        population.splice(0, 2);
        population.splice(-2, 2);

        tests.splice(0, 2);
        tests.splice(-2, 2);

        cases.splice(0, 2);
        cases.splice(-2, 2);

        casesPerMillion.splice(0, 2);
        casesPerMillion.splice(-2, 2);

        recovered.splice(0, 2);
        recovered.splice(-2, 2);

        deaths.splice(0, 2);
        deaths.splice(-2, 2);

        active.splice(0, 2);
        active.splice(-2, 2);

    });



    provinces.forEach(async function(province, index)
    {


        const pool = await poolPromise;

                
        var covidCasesInput = "insert into COVID_CASES (TotalConfirmed, TotalRecovered, TotalDeath, ActiveCases, TotalTests, Population, Source) OUTPUT inserted.ID VALUES( @TotalConfirmed, @TotalRecovered, @TotalDeath, @ActiveCases, @TotalTests, @Population, @Source)";       
        const resultCovidCases = await pool.request()
        .input('TotalConfirmed', Number(cases[index]))
        .input('TotalRecovered', Number(recovered[index]))
        .input('TotalDeath', Number(deaths[index]))
        .input('ActiveCases', Number(active[index]))
        .input('TotalTests', Number(tests[index]))
        .input('Population', Number(population[index]))
        .input('Source',"Wikipedia")
        .query(covidCasesInput, function (err, outputCovidCases) 
        {
            
            if (err) console.log(err);


            (outputCovidCases.recordset).forEach(async function(covidCases, indexCovidCases)
            {
                
                
                var provinceIDSelect = "select ID from Province where Name = @ProvinceName";
                const resultProvinceID = pool.request()
                .input('ProvinceName', String(province))
                .query(provinceIDSelect, async function (err, outputProvinceID) 
                {
                
                    if (err) console.log(err);

                    if(outputProvinceID.rowsAffected == 1)
                    {
                        (outputProvinceID.recordset).forEach(async function(ProvinceID, indexRegionID)
                        {

                            var provinceCasesInput = "insert into Province_Cases (Covid_CaseId, ProvinceCode) VALUES( @Covid_CaseId, @ProvinceCode)";
                            const resultProvinceCases = pool.request()
                            .input('Covid_CaseId', covidCases.ID)
                            .input('ProvinceCode', ProvinceID.ID)
                            .query(provinceCasesInput, function (err, outputProvinceCases) 
                            {
                            
                                if (err) console.log(err);
                                
                            });


                        });
                        
                    }
                    else
                    {

                        var provinceInsert = "insert into Province (Name, CountryId) OUTPUT inserted.ID SELECT @ProvinceName, ID FROM Country where Name='Canada'";

                        const resultProvince = pool.request()
                        .input('ProvinceName', String(province))
                        .query(provinceInsert, function (err, outputProvince) 
                        {
                            
                            if (err) console.log(err);

                            
                            if(outputProvince.rowsAffected == 1)
                            {
                                (outputProvince.recordset).forEach(async function(Province_Name, indexProvince)
                                {

                                    var provinceCasesInput = "insert into Province_Cases (Covid_CaseId, ProvinceCode) VALUES( @Covid_CaseId, @ProvinceCode)";
                                    const resultProvinceCases = pool.request()
                                    .input('Covid_CaseId', covidCases.ID)
                                    .input('ProvinceCode', Province_Name.ID)
                                    .query(provinceCasesInput, function (err, outputProvinceCases) 
                                    {
                                        
                                        if (err) console.log(err);
                                    
                                    });

                                });

                                
                            }
                        });
                    }

                
                }); 


            });
                    
        });
    

    });
    callback.apply(this,[]);
      
}



const regionsCanada = async (callback, title)=>
{

    var publicHealthUnit = [];
    var cases = [];
    var casesPerMillion = [];
    var recovered = [];
    var deaths = [];
    var deathsPerMillion = [];
    var activeCases = [];


    await axios.get('https://en.wikipedia.org/w/index.php?title=' + title).then((response) => 
    {
        // Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)

        const regionCases = $('table.wikitable.sortable tbody').first().find('tr').each( (index, element) => {

            if(title == "COVID-19_pandemic_in_Ontario")
            {
                publicHealthUnit.push($($(element).find('td')[0]).text().trim().replace(',',''));
                cases.push($($(element).find('td')[1]).text().trim().replace(/,/g, ''));
                casesPerMillion.push($($(element).find('td')[2]).text().trim().replace(/,/g, ''));
                recovered.push($($(element).find('td')[3]).text().trim().replace(/,/g, ''));
                deaths.push($($(element).find('td')[4]).text().trim().replace(/,/g, ''));
                deathsPerMillion.push($($(element).find('td')[5]).text().trim().replace(/,/g, ''));
            }
            else if(title == "COVID-19_pandemic_in_Nova_Scotia")
            {
                publicHealthUnit.push($($(element).find('td')[0]).text().trim());
                cases.push($($(element).find('td')[1]).text().trim());
                deaths.push($($(element).find('td')[4]).text().trim());
            }
            else if(title == "COVID-19_pandemic_in_Saskatchewan")
            {
                publicHealthUnit.push($($(element).find('td')[0]).text().trim());
                cases.push($($(element).find('td')[1]).text().trim());
                activeCases.push($($(element).find('td')[2]).text().trim());
                recovered.push($($(element).find('td')[5]).text().trim());
                deaths.push($($(element).find('td')[6]).text().trim());        
            }
            

        });

        if(title == "COVID-19_pandemic_in_Ontario")
        {
            publicHealthUnit.shift();
            cases.shift();
            casesPerMillion.shift();
            recovered.shift();
            deaths.shift();
            deathsPerMillion.shift();
        }
        else if(title == "COVID-19_pandemic_in_Nova_Scotia")
        {
            publicHealthUnit.splice(0, 2);
            cases.splice(0, 2);
            deaths.splice(0, 2);  
        }
        else if(title == "COVID-19_pandemic_in_Saskatchewan")
        {
            publicHealthUnit.splice(0, 2);
            publicHealthUnit.splice(-2, 2);
    
            cases.splice(0, 2);
            cases.splice(-2, 2);
    
            activeCases.splice(0, 2);
            activeCases.splice(-2, 2);
    
            recovered.splice(0, 2);
            recovered.splice(-2, 2);
    
            deaths.splice(0, 2);
            deaths.splice(-2, 2);            
        }
              
    });



    publicHealthUnit.forEach(async function(healthUnit, index)
    {


        const pool = await poolPromise;

        
        let active = Number(cases[index])-(Number(recovered[index])+Number(deaths[index]));
        
        var covidCasesInput = "insert into COVID_CASES (TotalConfirmed, TotalRecovered, TotalDeath, ActiveCases, Source) OUTPUT inserted.ID VALUES( @TotalConfirmed, @TotalRecovered, @TotalDeath, @ActiveCases, @Source)";       
        const resultCovidCases = await pool.request()
        .input('TotalConfirmed', Number(cases[index]))
        .input('TotalRecovered', Number(recovered[index]))
        .input('TotalDeath', Number(deaths[index]))
        .input('ActiveCases', Number(active))
        .input('Source',"Wikipedia")
        .query(covidCasesInput, function (err, outputCovidCases) 
        {
            
            if (err) console.log(err);

            (outputCovidCases.recordset).forEach(async function(covidCases, indexCovidCases)
            {
                
                
                var regionIDSelect = "select ID from Region where Name = @RegionName";
                const resultRegionID = pool.request()
                .input('RegionName', String(healthUnit))
                .query(regionIDSelect, async function (err, outputRegionID) 
                {
                
                    if (err) console.log(err);

                    if(outputRegionID.rowsAffected == 1)
                    {
                        (outputRegionID.recordset).forEach(async function(RegionID, indexRegionID)
                        {

                            var regionCasesInput = "insert into Region_Cases (Covid_CaseId, RegionCode) VALUES( @Covid_CaseId, @RegionCode)";
                            const resultRegionCases = pool.request()
                            .input('Covid_CaseId', covidCases.ID)
                            .input('RegionCode', RegionID.ID)
                            .query(regionCasesInput, function (err, outputRegionCases) 
                            {
                            
                                if (err) console.log(err);
                                
                            });


                        });
                        
                    }
                    else
                    {

                        if(title == "COVID-19_pandemic_in_Ontario")
                        {
                            var regionInsert = "insert into Region (Name, ProvinceId) OUTPUT inserted.ID SELECT @RegionName, ID FROM Province where Name='Ontario'";
                        }
                        else if(title == "COVID-19_pandemic_in_Nova_Scotia")
                        {
                            var regionInsert = "insert into Region (Name, ProvinceId) OUTPUT inserted.ID SELECT @RegionName, ID FROM Province where Name='Nova Scotia'";
                        }
                        else if(title == "COVID-19_pandemic_in_Saskatchewan")
                        {
                            var regionInsert = "insert into Region (Name, ProvinceId) OUTPUT inserted.ID SELECT @RegionName, ID FROM Province where Name='Saskatchewan'";       
                        }

                        const resultRegion = pool.request()
                        .input('RegionName', String(healthUnit))
                        .query(regionInsert, function (err, outputRegion) 
                        {
                            
                            if (err) console.log(err);

                            
                            if(outputRegion.rowsAffected == 1)
                            {
                                (outputRegion.recordset).forEach(async function(Region, indexRegion)
                                {
                                    var regionCasesInput = "insert into Region_Cases (Covid_CaseId, RegionCode) VALUES( @Covid_CaseId, @RegionCode)";
                                    const resultRegionCases = pool.request()
                                    .input('Covid_CaseId', covidCases.ID)
                                    .input('RegionCode', Region.ID)
                                    .query(regionCasesInput, function (err, outputRegionCases) 
                                    {
                                        
                                        if (err) console.log(err);
                                    
                                    });

                                });

                                
                            }
                        });
                    }

                
                }); 


            });
                    
        });
    

    });

	callback.apply(this,[]);      
}




countryWorld(function(){
    provinceCanada(function(){
        regionsCanada(function(){
            regionsCanada(function(){
                regionsCanada(function(){
                
                }, "COVID-19_pandemic_in_Saskatchewan");
            }, "COVID-19_pandemic_in_Nova_Scotia");
        }, "COVID-19_pandemic_in_Ontario");
    });
});



