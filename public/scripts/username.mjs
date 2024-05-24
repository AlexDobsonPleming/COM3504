const usernameKey = "username";

//gets username
export function getUsername() {
    return localStorage.getItem(usernameKey);
}

//sets username in the text field to be displayed
function fillUsernameField() {
    const usernameField = document.getElementById("headerUsernameField");
    usernameField.value = getUsername();

}

//sets username when button is clicked
function setUsernameButtonClicked() {
    const usernameField = document.getElementById("headerUsernameField");

    const usernameToSet = usernameField.value;
    localStorage.setItem(usernameKey, usernameToSet);
}

//checks for when user is submitting a username
document.addEventListener("DOMContentLoaded", function(event) {
    fillUsernameField();

    const setUsernameButton = document.getElementById("setUsernameButton");
    setUsernameButton.onclick = setUsernameButtonClicked;
});