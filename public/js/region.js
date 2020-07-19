document.addEventListener('DOMContentLoaded', (e)=> {
    e.preventDefault()
    const dateGiven=null
    fetch(dateGiven?`/allRegions?date=${dateGiven}`:`/allRegions`).then((response)=>{
        response.json().then((data)=>{
            if (data.error) {
                console.log('Error from Js')
            }
            else if (data == undefined) {
                console.log('No data found for province in database')
            }
            else {
                console.log(data)
                tableFunction(data,"tableRegion","tableBodyRegion")
            }
        })
    })
}, false);


document.querySelector('#sendLocation').addEventListener('click', (e) => {
    e.preventDefault()
    provinceReset()
    if (!navigator.geolocation) {
        document.querySelector('#sendLocation').setAttribute('disabled', 'disabled')
        return alert('GeoLocation is not supported by your browser. Please enter your place in the above form')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(`Longitude :${position.coords.longitude} Latitude :${position.coords.latitude}`)
        fetch(`/location?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`).then((response) => {

            response.json().then((data) => {
                if (data.error) {
                    console.log('Error :' + data.error)
                }
                else {
                    try {
                        const dataArray = data.data.body.plus_code.compound_code.split(' ')
                        const region = dataArray[1].replace(',', '')
                        console.log(region)
                        fetch(`/region?regionName=${region}`).then((response) => {
                            response.json().then((data) => {
                                if (data.error) {
                                    console.log('Error from Js')
                                }
                                else if (data[0] == undefined) {
                                    console.log('No data found for region in database')
                                }
                                else {
                                    regionData=data[0]
                                    console.log(data[0])
                                    totalCases.innerHTML=regionData['TotalConfirmed'].toString()
                                    totalDeaths.innerHTML=regionData['TotalDeath'].toString()
                                    activeCases.innerHTML=regionData['ActiveCases'].toString()
                                    recoveredCases.innerHTML=regionData['TotalRecovered'].toString()
                                    searchRegionValue.innerHTML=regionData['Name'].toString()
                                }
                            })
                        })
                        console.log(`Region Name: ${region}`)
                        console.log(`Province Name: ${dataArray[2]}`)
                    }
                    catch (e) {
                        console.log('Invalid Location')
                    }
                }
            })
        })
    })

})




document.querySelector('#regionSubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    provinceReset()
    const dateGiven = document.querySelector('#datePickerRegion').value
    const regionName = document.querySelector('#regionName').value.toString()
    if (regionName) {
        fetch(dateGiven ? `/region?date=${dateGiven}&regionName=${regionName}` : `/region?regionName=${regionName}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    console.log('Error from Js')
                }
                else if (data[0] == undefined) {
                    console.log('No data found for province in database')
                }
                else {
                    regionData=data[0]
                    console.log(data[0])
                    totalCases.innerHTML=regionData['TotalConfirmed'].toString()
                    totalDeaths.innerHTML=regionData['TotalDeath'].toString()
                    activeCases.innerHTML=regionData['ActiveCases'].toString()
                    recoveredCases.innerHTML=regionData['TotalRecovered'].toString()
                    searchRegionValue.innerHTML=regionData['Name'].toString()

                }
            })
        })
    }
    else {
        console.log('RegionName has not been entered')
    }

})

const regionReset=()=>{
    totalCases.innerHTML=''
    totalDeaths.innerHTML=''
    activeCases.innerHTML=''
    recoveredCases.innerHTML=''
    searchRegionValue.innerHTML=''
}

// document.querySelector('#allRegionsButton').addEventListener('click',(e)=>{
//     e.preventDefault()
//     const dateGiven = document.querySelector('#datePickerAllRegions').value
//     fetch(dateGiven?`/allRegions?date=${dateGiven}`:`/allRegions`).then((response)=>{
//         response.json().then((data)=>{
//             if (data.error) {
//                 console.log('Error from Js')
//             }
//             else if (data == undefined) {
//                 console.log('No data found for province in database')
//             }
//             else {
//                 console.log(data)
//                 tableFunction(data,"tableRegion","tableBodyRegion")
//             }
//         })
//     })
// })