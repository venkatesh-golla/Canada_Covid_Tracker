const tableFunction=(data,tableId,tableBodyId)=>{
    console.log(data)
    console.log("Table Id is "+tableId)
    console.log("Table Body Id is "+tableBodyId)
    if (data.length > 0) {
        var tempbody = ""
        data.forEach(element => {
            tempbody += "<tr>"
            tempbody += "<td>" + element.ActiveCases + "</td>"
            tempbody += "<td>" + element.DateTime.slice(0, 10) + "</td>"
            tempbody += "<td>" + element.Name + "</td>"
            tempbody += "<td>" + element.Population + "</td>"
            tempbody += "<td>" + element.Source + "</td>"
            tempbody += "<td>" + element.TotalConfirmed + "</td>"
            tempbody += "<td>" + element.TotalDeath + "</td>"
            tempbody += "<td>" + element.TotalRecovered + "</td>"
            tempbody += "<td>" + element.TotalTests + "</td>"
            tempbody += "</tr>"
        })
        document.querySelector(`#${tableId}`).style.display = 'contents'
        document.querySelector(`#${tableBodyId}`).innerHTML = tempbody
    }
    else{
        console.log('Data does not exist')
    }

}
