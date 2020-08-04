var regionNamesFromDb = []

document.addEventListener('DOMContentLoaded', function () {
    regionNames((names) => {
        names.forEach(name => {
            regionNamesFromDb.push(name)
        });
    })
    const dateGiven = null
    fetch(dateGiven ? `/countryGraph?date=${dateGiven}` : `/countryGraph`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                swal('Something went wrong please try again')
            }
            else if (data == undefined || data == null || data.length == 0) {
                swal('Country data not found')
            }
            else {
                const dataArray = []
                const datesArray=[]
                data.forEach(element => {
                    dataArray.push(element["TotalConfirmed"])
                });
                data.forEach(element => {
                    datesArray.push(element["DateTime"].substring(0,10))
                });
                chartDisplay(dataArray, 'graphCountryContainer', 'graphCountryCanvas',datesArray)
            }
        })
    })
})


document.querySelector('#graphRegionSubmitButton').addEventListener('click', (e) => {
    const regionName = document.querySelector("#searchRegionGraph").value.trim().toLowerCase()
    const regionParagraph = document.querySelector('#regionParagraph')
    var dateGiven = document.querySelector('#datePickerRegionGraph').value
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
        fetch(dateGiven ? `/regionGraph?date=${dateGiven}&regionName=${regionName}` : `/regionGraph?regionName=${regionName}`).then((response) => {

            response.json().then((data) => {
                if (data.error) {
                    swal('Error', 'Something Went Wrong Please try again', 'error')
                }
                else if (data == undefined || data == null || data.length == 0) {
                    swal('No data Found. Sorry!!!')
                }
                else {
                    const regionNameForGraph = document.querySelector('#regionNameForGraph')
                    const dataArray = []
                    const datesArray=[]
                    data.forEach(element => {
                        dataArray.push(element["TotalConfirmed"])
                    });
                    data.forEach(element => {
                        datesArray.push(element["DateTime"].substring(0,10))
                    });
                    regionParagraph.style.display = "inline"
                    chartDisplay(dataArray, 'graphContainer', 'graphCanvas',datesArray)
                    regionNameForGraph.innerHTML=`${regionName}`
                }
            })
        })
    }
})

document.querySelector('#locationGraph').addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        document.querySelector('#sendLocation').setAttribute('disabled', 'disabled')
        return swal('Sorry', 'GeoLocation is not supported by your browser. Please enter your place in the above form', 'warning')
        //return swal('GeoLocation is not supported by your browser. Please enter your place in the above form')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        fetch(`/location?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`).then((response) => {

            response.json().then((data) => {
                if (data.error) {
                    swal('Error', 'Something Went Wrong Please try again', 'error')
                }
                else {
                    try {
                        const dataArray = data.data.body.plus_code.compound_code.split(' ')
                        const regionName = dataArray[1].replace(',', '')
                        const regionNameForGraph = document.querySelector('#regionNameForGraph')
                        const dateGiven=null
                        fetch(dateGiven ? `/regionGraph?date=${dateGiven}&regionName=${regionName}` : `/regionGraph?regionName=${regionName}`).then((response) => {

                            response.json().then((data) => {
                                if (data.error) {
                                    swal('Error', 'Something Went Wrong Please try again', 'error')
                                }
                                else if (data == undefined || data == null || data.length == 0) {
                                    swal('No data Found. Sorry!!!')
                                }
                                else {
                                    const dataArray = []
                                    const datesArray=[]
                                    data.forEach(element => {
                                        dataArray.push(element["TotalConfirmed"])
                                    });
                                    data.forEach(element => {
                                        datesArray.push(element["DateTime"].substring(0,10))
                                    });
                                    regionParagraph.style.display = "inline"
                                    chartDisplay(dataArray, 'graphContainer', 'graphCanvas',datesArray)
                                    regionNameForGraph.innerHTML=`${regionName}`
                                }
                            })
                        })


                    }
                    catch (e) {
                        swal('Error', 'Unable to Find Your Location', 'error')
                    }
                }
            })
        })
    })
})


// document.addEventListener('DOMContentLoaded', function() {
//     const dateGiven=null
//     fetch(dateGiven ? `/provinceGraph?date=${dateGiven}`: `/provinceGraph`).then((response) => {
//         response.json().then((data) => {
//             if (data.error) {
//                 console.log('Error from Js')
//             }
//             else if (data == undefined||null) {
//                 console.log('No data found for province in database')
//             }
//             else {
//                 const dataArray=[]
//                 data.forEach(element => {
//                     dataArray.push(element["TotalConfirmed"])                    
//                 });
//                 chartDisplay(dataArray)
//             }
//         })
//     })
// }, false);

const chartDisplay = (dataArray, containerId, canvasId,datesArray) => {
    document.getElementById(`${containerId}`).innerHTML = '&nbsp;'
    document.getElementById(`${containerId}`).innerHTML = `<canvas id="${canvasId}" style="width: 600px;height: 600px;"></canvas>`
    var ctx = document.getElementById(`${canvasId}`).getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datesArray,
            datasets: [{
                label: '# of Cases',
                data: dataArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}


const regionReset = () => {
    const regionNameForGraph = document.querySelector('#regionNameForGraph')
    regionNameForGraph.innerHTML=``
    searchRegionGraph.value = ''
    datePickerRegionGraph.value = ''
}