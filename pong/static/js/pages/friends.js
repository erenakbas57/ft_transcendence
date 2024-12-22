// CSRF token almak için fonksiyon
function getCSRFToken() {
    const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
    return csrfToken;
}

// Takip/Unfollow butonunu dinamik olarak değiştirme
function handleUnfollowFriend(username, button) {
    fetch(`/unfollow_user/${username}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCSRFToken(),
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.action === 'unfollow') {
            const friendElement = document.getElementById(`friend-${username}`);
            if (friendElement) {
                friendElement.remove();
            }
        } else {
            alert(data.message || 'An error occurred.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
}

