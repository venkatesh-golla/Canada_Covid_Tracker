var regionNames = (callback) => {
    fetch('/regionNames').then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log('Unable to fetch region Names')
            }
            else if (data == null) {
                console.log('No region Names fetched')
            }
            else {
                const dataArray = data.recordsets[0]
                const regionNamesArray = []
                dataArray.forEach(element => {
                    regionNamesArray.push(element["Name"].toLowerCase())
                });
                callback(Object.values(regionNamesArray))
            }
        })
    })
}

var provinceNames = (callback)=> {
    fetch('/provinceNames').then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log('Unable to fetch province Names')
            }
            else if (data == null) {
                console.log('No province Names fetched') 
            }
            else {
                const dataArray = data.recordsets[0]
                const provinceNamesArray = []
                dataArray.forEach(element => {
                    provinceNamesArray.push(element["Name"].toLowerCase())
                });
                callback(Object.values(provinceNamesArray)) 
            }
        })
    })
}