document.addEventListener('DOMContentLoaded', function() {
    const selectedBlogId = localStorage.getItem('selectedBlogId');
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const selectedBlog = blogs.find(blog => blog.id === selectedBlogId);

    if (selectedBlog) {
        document.title = selectedBlog.title;
        const blogHeading = document.querySelector('.blog-heading h1');
        blogHeading.textContent = selectedBlog.title;
        blogHeading.contentEditable = true;

        const authorUpdate = document.querySelector('.author-update');
        authorUpdate.textContent = selectedBlog.author;
        authorUpdate.contentEditable = true;

        const publicationTime = document.querySelector('.publication-time');

        // Function to format date and time
        function formatDateTime() {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedTime = currentDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false // Use 24-hour format
            });
            publicationTime.textContent = `${formattedDate}, ${formattedTime}`;
        }

        // Set initial publication time
        formatDateTime();

        const blogContent = document.querySelector('.blog-content');
        blogContent.innerHTML = selectedBlog.content;
        blogContent.contentEditable = true;

        document.getElementById('save-changes').addEventListener('click', function() {
            selectedBlog.title = blogHeading.textContent;
            selectedBlog.author = authorUpdate.textContent;
            selectedBlog.content = blogContent.innerHTML;

            // Update publication time
            formatDateTime();

            localStorage.setItem('blogs', JSON.stringify(blogs));

            window.location.href = '../Admin Panel/admin-blogs.html';
        });
    } else {
        console.error('Selected blog not found');
    }
});