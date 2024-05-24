import {getImageAsBase64} from "./form_interactivity_common.mjs";

//previews image
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('myImage').addEventListener('change', async function(event) {
        if (event.target.files && event.target.files[0]) {
            const prospectiveTargetFile = event.target.files[0];

            const previewImage = document.getElementById('previewImage');
            previewImage.src = await getImageAsBase64(prospectiveTargetFile)
        }
    });
});