// DOM & events

const pickXButton = document.querySelector("#pick-x");
const pickOButton = document.querySelector("#pick-o");
const restartButton = document.querySelector("#restart");

pickXButton.addEventListener("click", () => {
    pickXButton.disabled = true;
    pickOButton.disabled = false;
});

pickOButton.addEventListener("click", () => {
    pickXButton.disabled = false;
    pickOButton.disabled = true;
});

restartButton.addEventListener("click", () => {
    console.log("Restarting game!");
});