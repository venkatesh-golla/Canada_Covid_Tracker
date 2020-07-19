document.addEventListener('DOMContentLoaded', (e)=> {
    e.preventDefault()
    const dateGiven=null
    fetch(dateGiven ? `/allProvinces?date=${dateGiven}`: `/allProvinces`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log('Error from Js')
            }
            else if (data == undefined||null) {
                console.log('No data found for province in database')
            }
            else {
                //const dataJson=JSON.parse(data)
                console.log(data)
                tableFunction(data,"tableProvince","tableBodyProvince")
            }
        })
    })
}, false);


document.querySelector('#provinceSubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const dateGiven = document.querySelector('#datePickerProvince').value
    const provinceName = document.querySelector('#provinceName').value.toString()
    var totalCases=document.querySelector('#totalCases')
    var totalDeaths=document.querySelector('#totalDeaths')
    var activeCases=document.querySelector('#activeCases')
    var recoveredCases=document.querySelector('#recoveredCases')
    var searchProvinceValue=document.querySelector('#searchProvinceValue')
    if (provinceName) {
        fetch(dateGiven ? `/province?date=${dateGiven}&provinceName=${provinceName}` : `/province?provinceName=${provinceName}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    console.log('Error from Js')
                }
                else if (data == undefined) {
                    console.log('No data found for province in database')
                }
                else {
                    provinceData=data[0]
                    console.log(data[0])
                    console.log(provinceData['TotalConfirmed'])
                    totalCases.innerHTML=provinceData['TotalConfirmed'].toString()
                    totalDeaths.innerHTML=provinceData['TotalDeath'].toString()
                    activeCases.innerHTML=provinceData['ActiveCases'].toString()
                    recoveredCases.innerHTML=provinceData['TotalRecovered'].toString()
                    searchProvinceValue.innerHTML=provinceData['Name'].toString()
                }
            })
        })
    }
    else {
        console.log('RegionName has not been entered')
    }

})

const provinceReset=()=>{
    totalCases.innerHTML=''
    totalDeaths.innerHTML=''
    activeCases.innerHTML=''
    recoveredCases.innerHTML=''
    searchProvinceValue.innerHTML=''
}

// document.querySelector('#allProvincesDataButton').addEventListener('click', (e) => {
//     e.preventDefault()
//     const dateGiven = document.querySelector('#datePickerAllProvinces').value
//         fetch(dateGiven ? `/allProvinces?date=${dateGiven}`: `/allProvinces`).then((response) => {
//             console.log('inside fetch')
//             response.json().then((data) => {
//                 if (data.error) {
//                     console.log('Error from Js')
//                 }
//                 else if (data == undefined||null) {
//                     console.log('No data found for province in database')
//                 }
//                 else {
//                     console.log(data)
//                     console.log(Object.keys(data[0]).length)
//                     tableFunction(data,"table","tablebody")
//                 }
//             })
//         })
// })