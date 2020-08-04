var regionNamesFromDb = []
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    regionNames((names) => {
        names.forEach(name => {
            regionNamesFromDb.push(name)
        });
    })
    const dateGiven = null
    fetch(dateGiven ? `/allRegions?date=${dateGiven}` : `/allRegions`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                swal('Error', 'Something Went Wrong Please try again', 'error')
            }
            else if (data == undefined) {
                swal('Sorry', 'No data found for region', 'warning')
            }
            else {
                tableFunction(data, "tableRegion", "tableBodyRegion")
                dateToday.innerHTML=moment().format('DD-MM-YYYY')
            }
        })
    })

}, false);


document.querySelector('#sendLocation').addEventListener('click', (e) => {
    e.preventDefault()
    regionReset()
    if (!navigator.geolocation) {
        document.querySelector('#sendLocation').setAttribute('disabled', 'disabled')
        return swal('Sorry', 'GeoLocation is not supported by your browser. Please enter your place in the above form', 'warning')
        //return swal('GeoLocation is not supported by your browser. Please enter your place in the above form')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(`Longitude :${position.coords.longitude} Latitude :${position.coords.latitude}`)
        fetch(`/location?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`).then((response) => {

            response.json().then((data) => {
                if (data.error) {
                    console.log('Error :' + data.error)
                    swal('Error', 'Something Went Wrong Please try again', 'error')
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
                                    swal('Error', 'Something Went Wrong Please try again', 'error')
                                }
                                else if (data[0] == undefined) {
                                    swal('Sorry', 'No data found for region', 'warning')
                                }
                                else {
                                    regionData = data[0]
                                    console.log(data[0])
                                    totalCases.innerHTML = regionData['TotalConfirmed'].toString()
                                    totalDeaths.innerHTML = regionData['TotalDeath'].toString()
                                    activeCases.innerHTML = regionData['ActiveCases'].toString()
                                    recoveredCases.innerHTML = regionData['TotalRecovered'].toString()
                                    searchRegionValue.innerHTML = regionData['Name'].toString()
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
    const dateGiven = document.querySelector('#datePickerRegion').value.trim()
    const regionName = document.querySelector('#regionName').value.trim().toLowerCase().toString()
    const letters = /^[A-Za-z-&/(/) ]+$/
    if (regionName == "") {
        regionReset()
        return swal('Region Name has not been entered')
    }
    else if (!regionName.match(letters)) {
        regionReset()
        return swal('Region name should contain only letters')
    }
    else if (dateGiven > moment().format('YYYY-MM-DD')) {
        regionReset()
        return swal('No future dates please')
    }
    // else if (!regionNamesFromDb.includes(regionName)) {
    //     regionReset()
    //     return swal('Please enter a valid region name')
    // }
    else {
        fetch(dateGiven ? `/region?date=${dateGiven}&regionName=${regionName}` : `/region?regionName=${regionName}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    swal('Error', 'Error from Js', 'error')
                }
                else if (data[0] == undefined) {
                    swal('Sorry', 'No data found for region', 'warning')
                }
                else {
                    regionData = data[0]
                    console.log(data[0])
                    totalCases.innerHTML = regionData['TotalConfirmed'].toString()
                    totalDeaths.innerHTML = regionData['TotalDeath'].toString()
                    activeCases.innerHTML = regionData['ActiveCases'].toString()
                    recoveredCases.innerHTML = regionData['TotalRecovered'].toString()
                    searchRegionValue.innerHTML = regionData['Name'].toString()

                }
            })
        })
    }

})

const regionReset = () => {
    regionName.value = ''
    datePickerRegion.value = ''
    totalCases.innerHTML = ''
    totalDeaths.innerHTML = ''
    activeCases.innerHTML = ''
    recoveredCases.innerHTML = ''
    searchRegionValue.innerHTML = ''
}

// document.querySelector('#allRegionsButton').addEventListener('click',(e)=>{
//     e.preventDefault()
//     const dateGiven = document.querySelector('#datePickerAllRegions').value
//     fetch(dateGiven?`/allRegions?date=${dateGiven}`:`/allRegions`).then((response)=>{
//         response.json().then((data)=>{
//             if (data.error) {
//                 console.log('Error from Js')
//                  swal('Error','Something Went Wrong Please try again','error')
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