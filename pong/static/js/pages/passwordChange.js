function handlePasswordChange(formId) {
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
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': formData.get('csrfmiddlewaretoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Edit başarılıysa, profil sayfasına yönlendirme
            pageHandler(`/profile/${data.username}`);
        } else {
            pageHandler(`/profile/${data.username}/password_change`);
            // showToast(data.message || 'Login failed!', 'error');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        // showToast('An unexpected error occurred!', 'error');
    });
}