document.querySelector('#feedbackButton').addEventListener('click',(e)=>{
    e.preventDefault()
    const firstName=document.querySelector('#fname').value.trim()
    const lastName=document.querySelector('#lname').value.trim()
    const emailId=document.querySelector('#email').value.trim()
    const country=document.querySelector('#country').value.trim()
    const subject=document.querySelector('#subject').value.trim()
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
                swal('Success','Feedback Sent Success','success')
            }
        })
    })
})