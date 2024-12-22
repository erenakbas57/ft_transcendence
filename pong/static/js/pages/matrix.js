export function startMatrixEffect() {
    const heroElement = document.querySelector(".hero");
    const canvas = document.createElement("canvas");
    canvas.className = "matrix-canvas";
    heroElement.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Hero konteynerinin boyutlarına göre canvas boyutunu ayarlıyoruz
    canvas.width = heroElement.offsetWidth;
    canvas.height = heroElement.offsetHeight;

    const letters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const fontSize = 12; // Font boyutunu küçültüyoruz, böylece daha fazla yazı sığar
    const columns = canvas.width / fontSize;

    const drops = Array(Math.floor(columns)).fill(0);

    function draw() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Yazının daha hızlı akmasını sağlıyoruz (daha fazla hareket)
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.965) {
                drops[i] = 0;
            }

            // Daha hızlı hareket için, her geçişte drops değerini hızlıca artırıyoruz
            drops[i]++;
        }
    }

    setInterval(draw, 50); // Daha hızlı akması için aralığı kısaltıyoruz (50'den 30'a)

    // Ekran boyutları değiştiğinde canvas boyutlarını tekrar ayarlıyoruz
    window.addEventListener("resize", () => {
        canvas.width = heroElement.offsetWidth;
        canvas.height = heroElement.offsetHeight;
        drops.length = Math.floor(canvas.width / fontSize);
    });
}
