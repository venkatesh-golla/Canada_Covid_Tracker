const postmanReq = require('postman-request')

const locationName=(latitude, longitude, callback)=>{
    const url=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&key=${process.env.keyforapi}`

    postmanReq({url,json:true},(error,{body})=>{
        if(error){
            callback('Unable to connect to API',undefined)
            
        }
        else{
            callback(undefined,{
                body
            })
        }
    })
}

module.exports=locationName