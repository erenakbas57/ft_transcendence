export function initProfilePage() {
    const pongStats = document.getElementById("pong-stats");
    const pongWins = parseInt(pongStats.dataset.wins, 10);
    const pongLosses = parseInt(pongStats.dataset.losses, 10);

    const rpsStats = document.getElementById("rps-stats");
    const rpsWins = parseInt(rpsStats.dataset.wins, 10);
    const rpsLosses = parseInt(rpsStats.dataset.losses, 10);

    const totalPongMatches = pongWins + pongLosses;
    const totalRpsMatches = rpsWins + rpsLosses;

    const pongData = [pongWins, pongLosses];
    const pongColors = ["#4caf50", "#f44336"];

    const rpsData = [rpsWins, rpsLosses];
    const rpsColors = ["#4caf50", "#f44336"];

    const gameData = [totalPongMatches, totalRpsMatches];
    const gameColors = ["#2196f3", "#ff9800"];

    // Grafiklerin çizimi
    drawPieChart("PongPieChart", pongData, pongColors);
    drawPieChart("RPSPieChart", rpsData, rpsColors);
    drawPieChart("GamePieChart", gameData, gameColors);
}


export function drawPieChart(canvasId, data, colors) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Verinin toplamını kontrol et
    const total = data.reduce((sum, value) => sum + value, 0);

    // Eğer toplam veri 0 ise, siyah bir grafik çiz ve ortasında "Veri Yok" yazısı ekle
    if (total === 0) {
        drawNoDataChart(ctx, canvas);
        return;
    }

    let startAngle = 0;

    canvas.width = 200; // Canvas genişliği
    canvas.height = 200; // Canvas yüksekliği
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        // Dilimi çiz
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();

        startAngle = endAngle;
    });
}

// Veri yoksa siyah grafik ve ortada "Veri Yok" yazısı ekleyen fonksiyon
function drawNoDataChart(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    // Siyah bir daire çiz
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();

    // "Veri Yok" yazısını ortada göstermek
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Veri Yok', centerX, centerY);
}
