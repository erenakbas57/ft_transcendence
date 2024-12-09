document.addEventListener("DOMContentLoaded", () => {
    const settings_submit = document.getElementById("submitInput");
    if (settings_submit) {
        console.log("submitInput bulundu.");
        settings_submit.addEventListener("keydown", (event) => {
            console.log("Click çalışıyor:", event.type);
        });
    } else {
        console.error("submitInput bulunamadı!");
    }

});
console.log("pong.js yüklendi!");