function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const btnToggle = document.querySelector('.btn-toggle');

    sidebar.classList.toggle('active');
    content.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        btnToggle.innerHTML = 'Close Sidebar';
    } else {
        btnToggle.innerHTML = 'Open Sidebar';
    }
}
