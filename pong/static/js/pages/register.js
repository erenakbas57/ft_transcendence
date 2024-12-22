function handleRegister(formId) {
    const form = document.getElementById(formId);

    if (!form) {
        console.error(`Form with ID "${formId}" not found.`);
        // showToast('Form not found!', 'error');
        return;
    }

    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest', // AJAX isteği olduğunu belirtmek için
            'X-CSRFToken': formData.get('csrfmiddlewaretoken') // CSRF koruması için
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                pageHandler('/login');
            } else {
                pageHandler('/register');
                // showToast(data.message || 'Login failed!', 'error');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            // showToast('An unexpected error occurred!', 'error');
        });
}
