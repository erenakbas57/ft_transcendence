document.addEventListener('DOMContentLoaded', function () {
    updateApp(window.location.pathname);
});

function updateApp(path) {
    fetch(path)
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html;
    })
    .catch(error => console.log(error));
}

function updateTitle(path) {
    var parts = path.split('/');

    if (parts.length > 0) {
        parts.shift();

        var titleParts = parts.map(function (part) {
            return part.charAt(0).toUpperCase() + part.slice(1);
        });

        var title = titleParts.join(' ');
    }
    else {
        var title = 'TransCat';
    }

    if (!title)
        title = 'TransCat';
    document.title = title;
}

function swapApp(path) {
    window.history.pushState({}, '', path);
    updateApp(path);
    updateTitle(path);
}

window.updateApp = updateApp;
window.swapApp = swapApp;

window.onpopstate = function (event) {
    if (window.location.hash == '') {
        updateApp(window.location.pathname);
    }
};