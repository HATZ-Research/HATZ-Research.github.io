let inactivityTimeout;
const LOCK_PIN = "1234";
let violationCount = 0;
function startInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(showScreenProtector, 5000); 
}

document.addEventListener("mousemove", startInactivityTimer);
document.addEventListener("keydown", startInactivityTimer);
document.addEventListener("click", startInactivityTimer);
document.addEventListener("DOMContentLoaded", startInactivityTimer);
function showScreenProtector() {
    const protector = document.createElement("div");
    protector.id = "screenProtector";
    protector.className = "overlay";
    protector.innerHTML = `
        <h2>화면이 잠겼습니다</h2>
        <input type="password" id="pinInput" placeholder="PIN 입력" autofocus>
        <button onclick="checkPIN()">해제</button>
    `;
    document.body.appendChild(protector);
    document.getElementById("pinInput").focus();
    requestFullscreen();
}
function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        violationCount++;
        alert(" (${violationCount})`);
        logViolation();
    }
});
function logViolation() {
    console.warn(`부정행위 감지: ${violationCount}회`);
}
document.addEventListener("keydown", (e) => {
    if (document.getElementById("screenProtector") && e.key === "Escape") {
        e.preventDefault();
    }
});
function checkPIN() {
    const pinInput = document.getElementById("pinInput").value;
    if (pinInput === LOCK_PIN) {
        closeScreenProtector();
    } else {
        alert("잘못된 PIN입니다.");
    }
}
function closeScreenProtector() {
    document.getElementById("screenProtector").remove();
    exitFullscreen();
    startInactivityTimer();
}
function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

startInactivityTimer();