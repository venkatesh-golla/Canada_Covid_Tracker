document.querySelector('#feedbackButton').addEventListener('click', (e) => {
    e.preventDefault()
    const firstName = document.querySelector('#fname').value.trim()
    const lastName = document.querySelector('#lname').value.trim()
    const emailId = document.querySelector('#email').value.trim()
    const country = document.querySelector('#country').value.trim()
    const subject = document.querySelector('#subject').value.trim()
    const letters = /^[A-Za-z-&/(/) ]+$/
    const bodyData = {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        country: country,
        comments: subject
    }
    if (firstName == null || firstName == '' || lastName == null || lastName == '' || emailId == null || emailId == '' || country == null || country == '' || subject == null || subject == '') {
        swal('Error', 'Please Make Sure to enter details in all fields', 'error')
    }else if(!firstName.match(letters) || !lastName.match(letters) || !country.match(letters)){
        swal('Error', 'Please use valid details', 'error')
    }
    else {
        // console.log(bodyData)
        // console.log(JSON.stringify(bodyData))
        try {
            fetch('/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json;charset=utf-8' }, body: JSON.stringify(bodyData) }).then((response) => {
                response.json().then((data) => {
                    if (data.Error) {
                        swal('Error', data.Error, 'error')
                    } else {
                        swal('Success', 'Feedback Sent Successfully', 'success')
                    }
                })
            })
        }
        catch (e) {
            console.log(data.error)
            swal('Error', 'Feedback has not been sent. Please try again', 'error')
        }
    }
})