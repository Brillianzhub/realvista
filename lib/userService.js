
export const getCurrentUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
    };
};


// lib/userService.js

export const getRCurrentUser = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/accounts/current_user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};
