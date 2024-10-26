
export const getCurrentUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
    };
};
