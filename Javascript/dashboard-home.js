document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('user-table').getElementsByTagName('tbody')[0];
    const totalUsersElement = document.querySelector('.card-numbers p');
    const totalBlogsUsers = document.querySelector('.card-numbers .blogs-nbr');

    const checkAuthentication = async () => {
        let response;
        try {
            response = await fetch('http://localhost:3000/auth/authenticated', {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Response is not OK');
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = '../Authentication/Login.html';
            return false;
        }
        
        try {
            const userData = await response.json();
            console.log(userData);
            const adminName = document.querySelector('.admin-details-top .admin-name');
            if (adminName) {
                adminName.textContent = `${userData.firstname} ${userData.lastname}`;
            } else {
                console.error('Admin name element not found');
            }
            
            return true;

        } catch (error) {
            console.error('Error parsing JSON:', error);
            return false;
        }
    };

    
    checkAuthentication().then(isAuthenticated => {
        if (isAuthenticated) {
            fetchUsers();
            fetchBlogs();
            addLogoutEvent();
        }
    });

    
    
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:3000/user');
            const users = await response.json();

            updateTotalUsersCount(users.length);

            const startIdx = Math.max(users.length - 4, 0);
            const endIdx = users.length;
            for (let i = startIdx; i < endIdx; i++) {
                const { firstname, lastname, email } = users[i];
                addUserToTable(firstname, lastname, email);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error.message);
        }
    }


    async function fetchBlogs() {
        try {
            const response = await fetch('http://localhost:3000/blog/all');
            const blogs = await response.json();

            updateTotalBlogsCount(blogs.length);
        } catch (error) {
            console.error('Failed to fetch blogs:', error.message);
        }
    }


    function addUserToTable(firstname, lastname, email) {
        const newRow = table.insertRow();
        newRow.innerHTML = `<td><i class="fa-regular fa-user"></i>${firstname}</td>
                            <td>${lastname}</td>
                            <td>${email}</td>`;
    }

    function updateTotalUsersCount(count) {
        totalUsersElement.textContent = count;
    }
    function updateTotalBlogsCount(count) {
        totalBlogsUsers.textContent = count;
    }

    function addLogoutEvent() {

        const logoutButton = document.querySelector('.logout');
    
        logoutButton.addEventListener('click', async () => {
            let response;
            try {
                response = await fetch('http://localhost:3000/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
    
            try {
                const result = await response.json();
                console.log(result.message);
                window.location.href = `../Authentication/Login.html`;
            } catch (error) {
                console.log("logout error please!")
            }
        });
    }
});