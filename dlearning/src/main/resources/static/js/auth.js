// $(document).ready(function(){
//
//     function checkLogin(){
//         let token = localStorage.getItem('token');
//
//         if (token) {
//             $.ajax({
//                 url: `http://localhost:8080/api/v1/auth/introspect`,
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 data: JSON.stringify({ token: token }),
//                 success: function(response) {
//                     if (response.isAuthenticated) {
//                         // Người dùng đã đăng nhập
//                         $('#loginMenu').hide();
//                         $('#logoutMenu').show();
//                     } else {
//                         $('#loginMenu').show();
//                         $('#logoutMenu').hide();
//                     }
//                 },
//                 error: function() {
//                     $('#loginMenu').show();
//                     $('#logoutMenu').hide();
//                 }
//             });
//         } else {
//             $('#loginMenu').show();
//             $('#logoutMenu').hide();
//         }
//     }
//
//     // Gọi hàm checkLogin khi trang đã tải xong
//     checkLogin();
// });
