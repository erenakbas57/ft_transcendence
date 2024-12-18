// Sayfa yüklendiğinde, kullanıcının online durumunu kontrol et
// window.addEventListener('DOMContentLoaded', function() {
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = ''; // Yükleme durumunu göster
//     // Giriş yapıldığında 'status' öğesini 'online' yap
//     fetch('/api/get_user_status/')
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             if (data.is_online) {
//                 statusElement.textContent = 'Online'; // Kullanıcı online ise
//                 console.log("green");
//                 statusElement.style.color = 'green'; // İstenilen renk
//                 console.log('User is online');
//             } else {
//                 statusElement.textContent = 'Offline'; // Kullanıcı offline ise
//                 statusElement.style.color = 'red'; // İstenilen renk
//             }
//             console.log('User status fetched:', data);
//         })
//         .catch(error => console.error('Error fetching user status:', error));
// });