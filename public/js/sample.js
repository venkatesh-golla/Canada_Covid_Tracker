document.querySelector('#buttonPress').addEventListener('click', (e) => {
    e.preventDefault()
    console.log('Button Click Recorded')
})

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
                        const region = dataArray[1].replace(',','')
                        console.log(region)
                        fetch(`/region?regionName=${region}`).then((response)=>{
                            response.json().then((data)=>{
                                if(data.error){
                                    console.log('Error from Js')
                                }
                                else{
                                    console.log(data)
                                }
                            })
                        })
                        console.log(`Region Name: ${region}`)
                        console.log(`Province Name: ${dataArray[2]}`)
                    }
                    catch(e){
                        console.log('Invalid Location')
                    }
                }
            })
        })
    })

})

