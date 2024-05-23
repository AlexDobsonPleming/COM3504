const usernameKey = "username";

export function getUsername() {
    return localStorage.getItem(usernameKey);
}
function fillUsernameField() {
    const usernameField = document.getElementById("headerUsernameField");
    usernameField.value = getUsername();

}
function setUsernameButtonClicked() {
    const usernameField = document.getElementById("headerUsernameField");

    const usernameToSet = usernameField.value;
    localStorage.setItem(usernameKey, usernameToSet);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fillUsernameField();

    const setUsernameButton = document.getElementById("setUsernameButton");
    setUsernameButton.onclick = setUsernameButtonClicked;
});