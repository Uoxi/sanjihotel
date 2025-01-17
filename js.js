document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Dummy credentials (For example purpose only)
    const validUsername = 'sipa';
    const validPassword = '1234';

    // Check if the username and password are correct
    if (username === validUsername && password === validPassword) {
        // Redirect to the reservation system page upon successful login
        window.location.href = 'Gestion_Chambre.html'; // Modify with the correct reservation system page URL
    } else {
        // Display an error message
        alert('Nom d\'utilisateur ou mot de passe incorrect!');
    }
});