
function handleFriend() {
    const form = document.getElementById(formId);

    if (!form) {
        console.error(`Form with ID "${formId}" not found.`);
        return;
    }

    const formData = new FormData(form);

    fetch(form.action, {
        method: 'GET',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
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
    resultsContainer.innerHTML = ''; // Önceki sonuçları temizle

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach((user) => {
        const userElement = document.createElement('a');
        userElement.className = 'user-result';
        
        // Takip etme butonunu ekle
        const followButtonText = user.is_following ? 'Unfollow' : 'Follow';
        const followButtonClass = user.is_following ? 'btn-danger' : 'btn-primary';

        const profileImage = document.createElement('img');
        profileImage.src = user.avatar;
        profileImage.className = 'card-img-top user-img';
        profileImage.alt = 'Profile Picture';
        profileImage.setAttribute('onclick', `swapApp('/profile/${user.username}')`);  // Profil resmine tıklayınca kullanıcıya git

        userElement.innerHTML = `
                <div class=" user-card">
                    ${profileImage.outerHTML}
                    <div class="card-body user-body">
                        <h5 class="card-title text-center">${user.first_name} ${user.last_name}</h5>
                        <p class="card-text">${user.username}</p>
                        <button class="btn ${followButtonClass}" onclick="toggleFollow('${user.username}', this)">${followButtonText}</button>
                    </div>
                </div>
        `;
        resultsContainer.appendChild(userElement);
    });
}