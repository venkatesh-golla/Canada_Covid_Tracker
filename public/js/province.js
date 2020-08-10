// var provinceNamesFromDb=[]

document.addEventListener('DOMContentLoaded', (e)=> {
    e.preventDefault()
    // provinceNames((names)=>{
    //     names.forEach(name => {
    //         provinceNamesFromDb.push(name)
    //     });
    // })
    const dateGiven=null
    const dateToday = document.querySelector('#dateToday')
    fetch(dateGiven ? `/allProvinces?date=${dateGiven}`: `/allProvinces`).then((response) => {
        response.json().then((data) => {
            console.log(data.length)
            if (data.error) {
                swal('Error','Something Went Wrong Please try again','error')
            }
            else if (data == undefined||null || data.length==0) {
                swal('Sorry','No up to date data found for Provinces','warning')
            }
            else {
                //const dataJson=JSON.parse(data)
                console.log(data)
                tableFunction(data,"tableProvince","tableBodyProvince")
                dateToday.innerHTML=moment().format('DD-MM-YYYY')
            }
        })
    })
}, false);


document.querySelector('#provinceSubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const dateGiven = document.querySelector('#datePickerProvince').value
    const provinceName = document.querySelector('#provinceName').value.trim().toLowerCase().toString()
    const letters = /^[A-Za-z-&/(/) ]+$/
    var totalCases=document.querySelector('#totalCases')
    var totalDeaths=document.querySelector('#totalDeaths')
    var activeCases=document.querySelector('#activeCases')
    var recoveredCases=document.querySelector('#recoveredCases')
    var searchProvinceValue=document.querySelector('#searchProvinceValue')
    if(provinceName==""){
        provinceReset()
        return swal('Province name has not been entered')
    }
    else if(!provinceName.match(letters)){
        provinceReset()
        return swal('Province name should contain only letters')
    }
    else if (dateGiven > moment().format('YYYY-MM-DD')) {
        provinceReset()
        return swal('No future dates please')
    }
    // else if(!provinceNamesFromDb.includes(provinceName)){
    //     provinceReset()
    //     return swal('Please enter a valid province name')
    // }
    else{
        fetch(dateGiven ? `/province?date=${dateGiven}&provinceName=${provinceName}` : `/province?provinceName=${provinceName}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    provinceReset()
                    return swal('Error','Something Went Wrong Please try again','error')
                }
                else if (data[0] == undefined) {
                    provinceReset()
                   return swal('Sorry','No data found for Province','warning')
                }
                else {
                    provinceData=data[0]
                    console.log(provinceData)
                    totalCases.innerHTML=provinceData['TotalConfirmed'].toString()
                    totalDeaths.innerHTML=provinceData['TotalDeath'].toString()
                    activeCases.innerHTML=provinceData['ActiveCases'].toString()
                    recoveredCases.innerHTML=provinceData['TotalRecovered'].toString()
                    searchProvinceValue.innerHTML=provinceData['Name'].toString()
                }
            })
        })
    }

})

const provinceReset=()=>{
    datePickerProvince.value=''
    provinceName.value=''
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