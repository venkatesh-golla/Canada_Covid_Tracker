document.querySelector('#sendLocation').addEventListener('click', (e) => {
    e.preventDefault()
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
                                    console.log(data[0] == undefined)
                                    console.log(Object.keys(data[0]).length)
                                    tableFunction(data,"table","tablebody")
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


document.querySelector('#provinceDataButton').addEventListener('click', (e) => {
    e.preventDefault()
    const dateGiven = document.querySelector('#datePickerProvince').value
        fetch(dateGiven ? `/allProvinces?date=${dateGiven}`: `/allProvinces`).then((response) => {
            console.log('inside fetch')
            response.json().then((data) => {
                if (data.error) {
                    console.log('Error from Js')
                }
                else if (data == undefined||null) {
                    console.log('No data found for province in database')
                }
                else {
                    console.log(data)
                    console.log(Object.keys(data[0]).length)
                    tableFunction(data,"table","tablebody")
                }
            })
        })
})


document.querySelector('#regionDataButton').addEventListener('click', (e) => {
    e.preventDefault()
    const dateGiven = document.querySelector('#datePickerRegion').value
    const regionName = document.querySelector('#regionName').value.toString()
    if (regionName) {
        fetch(dateGiven ? `/region?date=${dateGiven}&regionName=${regionName}` : `/region?regionName=${regionName}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    console.log('Error from Js')
                }
                else if (data == undefined) {
                    console.log('No data found for province in database')
                }
                else {
                    console.log(data)
                    tableFunction(data,"table","tablebody")
                }
            })
        })
    }
    else {
        console.log('RegionName has not been entered')
    }

})

document.querySelector('#allRegionsButton').addEventListener('click',(e)=>{
    e.preventDefault()
    fetch('/allRegions').then((response)=>{
        response.json().then((data)=>{
            if (data.error) {
                console.log('Error from Js')
            }
            else if (data == undefined) {
                console.log('No data found for province in database')
            }
            else {
                console.log(data)
                tableFunction(data,"table","tablebody")
            }
        })
    })
})