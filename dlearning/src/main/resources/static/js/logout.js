$(document).ready(function(){
    $('#logout').click(function(event){
        event.preventDefault();

        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/v1/auth/logout`, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: token })
        }).then((response) => {
            if(response.ok){
                localStorage.clear();
                window.location.href='/login';
            }
            else{
                alert('Logout Failed');
            }
        }).catch(error =>{
            console.log(error);
        });
    });
});
