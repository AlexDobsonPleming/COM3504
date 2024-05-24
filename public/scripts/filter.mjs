//loops through buttons and sets relevant one to active when clicked
document.addEventListener('DOMContentLoaded', (event) => {
    const filterButtons = document.querySelectorAll('.filter-section button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
            this.classList.add('active'); // Add active class to the clicked button
        });
    });
});