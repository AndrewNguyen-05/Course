$(document).ready(function() {
    $("#login-form").submit(function(event) {
        event.preventDefault();

        let email = $('#email').val();
        let password = $('#password').val();

        let dataLogin = {
            email: email,
            password: password
        };

        fetch('http://localhost:8080/api/v1/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataLogin)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        }).then(data => {
            localStorage.setItem('token', data.result.token);
            alert('Login Successful!');

            window.location.href = '/home';
        }).catch(error => {
            alert(`Login Failed: ${error.message}`);
            console.log(error);
        });
    });
});
