
import {initProfilePage, drawPieChart} from './pages/profile.js';
import {PongTournament} from './pong/pong-tournament.js';
import {PongAI} from './pong/pong-ai.js';
import {PongLocal} from './pong/pong-local.js';
import {PongMultiplayer} from './pong/pong-multiplayer.js';
import {startMatrixEffect} from './pages/matrix.js';

document.addEventListener('DOMContentLoaded', function () {
    pageHandler(window.location.pathname);
});

window.onpopstate = function (event) {
    if (window.location.hash == '') {
        pageLoad(window.location.pathname);
    }
};

function pageLoad(path) {
    fetch(path)
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html;

        const errorPage = document.body.querySelector('.error-page');
        if (errorPage) {
            return;
        }
        switch (true) {
            case path.includes('/profile'):
                initProfilePage();
                break;
            case path.includes('/pong-tournament'):
                PongTournament();
                break;
            case path.includes('/pong-ai'):
                PongAI();
                break;
            case path.includes('/pong-local'):
                PongLocal();
                break;
            case path.includes('/pong-multiplayer'):
                PongMultiplayer();
                break;
            case path.includes('/home'):
                startMatrixEffect();
                break;
        }
    })
    .catch(error => console.log(error));
}

function pageHandler(path) {
    window.history.pushState({}, '', path);
    pageLoad(path);
}

window.pageHandler = pageHandler;
window.pageLoad = pageLoad;
window.drawPieChart = drawPieChart;
window.initProfilePage = initProfilePage;
window.PongTournament = PongTournament;
window.PongAI = PongAI;
window.PongLocal = PongLocal;
window.PongMultiplayer = PongMultiplayer;
window.startMatrixEffect = startMatrixEffect;