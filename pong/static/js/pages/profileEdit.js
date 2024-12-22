function handleProfileEdit(formId) {
    const form = document.getElementById(formId);

    if (!form) {
        console.error(`Form with ID "${formId}" not found.`);
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
            pageHandler(`/profile/${data.username}`);
        } else {
            pageHandler(`/profile/${data.username}/edit`);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
    });
}