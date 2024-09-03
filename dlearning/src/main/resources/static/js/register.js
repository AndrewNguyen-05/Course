$(document).ready(function(){
    $('#register-form').submit(function(event){
        event.preventDefault();

        let email = $('#email').val();
        let password = $('#password').val();
        let firstName = $('#firstname').val();
        let lastName = $('#lastname').val();
        let dob = $('#dob').val();

        let dataRegister = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            dob: dob
        };

        fetch('http://localhost:8080/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataRegister)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        }).then(data => {
            alert('Registration successful!');
            window.location.href = '/login';
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert(`${error.message}`);
        });
    });

});
