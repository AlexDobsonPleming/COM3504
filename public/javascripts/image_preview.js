document.getElementById('myImage').addEventListener('change', function(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // Get the existing image element by ID
            var previewImage = document.getElementById('previewImage');
            // Set its source to the current file's Data URL
            previewImage.src = e.target.result;
        };
        // Read the file as a Data URL
        reader.readAsDataURL(event.target.files[0]);
    }
});