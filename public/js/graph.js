var regionNamesFromDb = []

document.addEventListener('DOMContentLoaded', function () {
    regionNames((names) => {
        names.forEach(name => {
            regionNamesFromDb.push(name)
        });
    })
    const dateGiven = null
    console.log('inside country graph listener')
    fetch(dateGiven ? `/countryGraph?date=${dateGiven}` : `/countryGraph`).then((response) => {
        console.log('inside fetch of graph')
        response.json().then((data) => {
            if (data.error) {
                alert('Something went wrong please try again')
            }
            else if (data == undefined || data == null || data.length == 0) {
                alert('No data found')
            }
            else {
                const dataArray = []
                data.forEach(element => {
                    dataArray.push(element["TotalConfirmed"])
                });
                console.log(data)
                console.log(dataArray)
                chartDisplay(dataArray, 'graphCountryContainer', 'graphCountryCanvas')
            }
        })
    })
})


document.querySelector('#graphRegionSubmitButton').addEventListener('click', (e) => {
    const regionName = document.querySelector("#searchRegionGraph").value.trim().toLowerCase()
    const regionParagraph = document.querySelector('#regionParagraph')
    var dateGiven = document.querySelector('#datePickerRegionGraph').value
    const letters = /^[A-Za-z, ]+$/
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
    else if (!regionNamesFromDb.includes(regionName)) {
        regionReset()
        return swal('Please enter a valid region name')
    } 
    else {
        fetch(dateGiven ? `/regionGraph?date=${dateGiven}&regionName=${regionName}` : `/regionGraph?regionName=${regionName}`).then((response) => {
            console.log('inside fetch of graph')
            response.json().then((data) => {
                if (data.error) {
                    swal('Error', 'Something Went Wrong Please try again', 'error')
                }
                else if (data == undefined || data == null || data.length == 0) {
                    swal('No data Found. Sorry!!!')
                }
                else {
                    const dataArray = []
                    data.forEach(element => {
                        dataArray.push(element["TotalConfirmed"])
                    });
                    console.log(data)
                    console.log(dataArray)
                    regionParagraph.style.display = "inline"
                    chartDisplay(dataArray, 'graphContainer', 'graphCanvas')
                }
            })
        })
    }
})




// document.addEventListener('DOMContentLoaded', function() {
//     const dateGiven=null
//     fetch(dateGiven ? `/provinceGraph?date=${dateGiven}`: `/provinceGraph`).then((response) => {
//         console.log('inside fetch of graph')
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
//                 console.log(dataArray)
//                 console.log(data)
//                 chartDisplay(dataArray)
//             }
//         })
//     })
// }, false);

const chartDisplay = (dataArray, containerId, canvasId) => {
    document.getElementById(`${containerId}`).innerHTML = '&nbsp;'
    document.getElementById(`${containerId}`).innerHTML = `<canvas id="${canvasId}" style="width: 600px;height: 600px;"></canvas>`
    console.log(`${canvasId}`)
    var ctx = document.getElementById(`${canvasId}`).getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
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
                borderWidth: 1
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
    console.log(ctx)
}


const regionReset = () => {
    searchRegionGraph.value = ''
    datePickerRegionGraph.value = ''
}