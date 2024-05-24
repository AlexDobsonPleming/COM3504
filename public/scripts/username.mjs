const usernameKey = "username";

export function getUsername() {
    return localStorage.getItem(usernameKey);
}
export function setUsername(username) {
    localStorage.setItem(usernameKey, username);
}

function fillUsernameField() {
    const usernameField = document.getElementById("headerUsernameField");
    usernameField.value = getUsername();

}
function setUsernameButtonClicked() {
    const usernameField = document.getElementById("headerUsernameField");

    const usernameToSet = usernameField.value;
    setUsername(usernameToSet);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fillUsernameField();

    const setUsernameButton = document.getElementById("setUsernameButton");
    setUsernameButton.onclick = setUsernameButtonClicked;
});