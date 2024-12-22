function logout() {
    // Logout işlemi için gerekli API çağrısı veya redirect yapılabilir
    fetch('/logout')
        .then(response => {
            if (response.ok) {
                // Logout başarılı, sayfa URL'sini güncelle
                window.history.pushState({}, '', '/login');  // URL'yi /login olarak güncelle
                pageHandler('/login');  // /login sayfasını yükle
            } else {
                console.error('Logout işlemi başarısız');
            }
        })
        .catch(error => console.error('Logout hatası:', error));
}

window.logout = logout;
