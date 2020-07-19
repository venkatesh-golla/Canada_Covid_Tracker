document.querySelector('#feedbackButton').addEventListener('click',(e)=>{
    e.preventDefault()
    const firstName=document.querySelector('#fname').value
    const lastName=document.querySelector('#lname').value
    const emailId=document.querySelector('#email').value
    const country=document.querySelector('#country').value
    const subject=document.querySelector('#subject').value
    const bodyData={
        firstName:firstName,
        lastName:lastName,
        emailId:emailId,
        country:country,
        comments:subject
    }
    console.log(bodyData)
    console.log(JSON.stringify(bodyData))
    fetch('/feedback',{method:'POST',  headers: {'Content-Type': 'application/json;charset=utf-8'},body:JSON.stringify(bodyData)}).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                console.log(data.error)
            }else{
                console.log(data)
            }
        })
    })
})