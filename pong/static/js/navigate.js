
import {initProfilePage, drawPieChart} from './usermanage/profile.js';
import {PongTournament} from './pong/pong-tournament.js';
import {PongAI} from './pong/pong-ai.js';
import {PongLocal} from './pong/pong-local.js';
import {PongMultiplayer} from './pong/pong-multiplayer.js';
import {startMatrixEffect} from './pages/matrix.js';

document.addEventListener('DOMContentLoaded', function () {
    pageHandler(window.location.pathname, false);
});

window.onpopstate = function (event) {
    if (window.location.hash == '') {
        pageHandler(window.location.pathname);
    }
};

function pageHandler(path, state= true) {
    if (state) 
        window.history.pushState({}, '', path);
    
    fetch(path)
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html;
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

window.pageHandler = pageHandler;

window.drawPieChart = drawPieChart;
window.initProfilePage = initProfilePage;

window.PongTournament = PongTournament;
window.PongAI = PongAI;
window.PongLocal = PongLocal;
window.PongMultiplayer = PongMultiplayer;
window.startMatrixEffect = startMatrixEffect;


