
function handleSearch(formId) {
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
            'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                updateSearchResults(data.results);
            } else {
                updateSearchResults([]);
                console.warn(data.message || 'No results found.');
            }
        })
        .catch((error) => {
            console.log('Search error:', error);
        });
}

function updateSearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach((user) => {
        const userElement = document.createElement('a');
        userElement.className = 'user-result';
        
        const followButtonText = user.is_following ? 'Unfollow' : 'Follow';
        const followButtonClass = user.is_following ? 'btn-danger' : 'btn-primary';

        const profileImage = document.createElement('img');
        profileImage.src = user.avatar;
        profileImage.className = 'card-img-top user-img';
        profileImage.alt = 'Profile Picture';
        profileImage.setAttribute('onclick', `pageHandler('/profile/${user.username}')`); 

        userElement.innerHTML = `
                <div class=" user-card">
                    ${profileImage.outerHTML}
                    <div class="card-body user-body">
                        <h5 class="card-title text-center">${user.first_name} ${user.last_name}</h5>
                        <p class="card-text">${user.username}</p>
                        <button class="btn ${followButtonClass}" onclick="handleFollow('${user.username}', this)">${followButtonText}</button>
                    </div>
                </div>
        `;
        resultsContainer.appendChild(userElement);
    });
}

function handleFollow(username, button) {
    fetch(`/follow_unfollow_user/${username}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCSRFToken(),
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.action === 'follow') {
                button.textContent = 'Unfollow';
                button.classList.remove('btn-primary');
                button.classList.add('btn-danger');
            } else {
                button.textContent = 'Follow';
                button.classList.remove('btn-danger');
                button.classList.add('btn-primary');
            }
        }
    })
    .catch(error => {
        console.log('Error:', error);
        alert('Something went wrong. Please try again.');
    });
}

function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}
