let reservations = [];
let rooms = Array.from({ length: 100 }, (_, i) => {
    const roomType = i % 3 === 0 ? "Suite" : i % 2 === 0 ? "Double" : "Single";
    const price = roomType === "Suite" ? 150 : roomType === "Double" ? 80 : 50;
    return { number: 101 + i, type: roomType, price };
});

// Fonction pour vérifier la disponibilité d'une chambre
function isRoomAvailableForDates(roomNumber, arrival, departure) {
    return !reservations.some(res => 
        res.room === roomNumber &&
        ((new Date(arrival) <= new Date(res.departure)) &&
         (new Date(departure) >= new Date(res.arrival)))
    );
}

// Afficher les chambres disponibles
function showAvailableRooms() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Vérifier les chambres disponibles</h2>
        <form id="check-available-rooms-form">
            <label for="check-arrival">Date d'arrivée:</label>
            <input type="date" id="check-arrival" required>
            
            <label for="check-departure">Date de départ:</label>
            <input type="date" id="check-departure" required>
    
            <label for="room-type-filter">Type de Chambre:</label>
            <select id="room-type-filter">
                <option value="">Tous</option>
                <option value="Suite">Suite Présidentiel (€150 par nuit)</option>
                <option value="Double">Chambre Double (€80 par nuit)</option>
                <option value="Single">Chambre Single (€50 par nuit)</option>
            </select>
            
            <button type="submit">Vérifier la disponibilité</button>
        </form>
        <div id="available-rooms"></div>
    `;

    document
        .getElementById("check-available-rooms-form")
        .addEventListener("submit", checkAvailableRooms);
}

// Vérifier la disponibilité des chambres et afficher les résultats
function checkAvailableRooms(e) {
    e.preventDefault();
    const arrival = document.getElementById("check-arrival").value;
    const departure = document.getElementById("check-departure").value;
    const roomTypeFilter = document.getElementById("room-type-filter").value;

    if (new Date(arrival) >= new Date(departure)) {
        showCustomModal("⚠️ La date de départ doit être postérieure à la date d'arrivée. Merci de corriger vos dates.");
        return;
    }

    const filteredRooms = rooms.filter(room => 
        roomTypeFilter === "" || room.type === roomTypeFilter
    );

    const availableRooms = filteredRooms.map(room => {
        const isAvailable = isRoomAvailableForDates(room.number, arrival, departure);
        return {
            ...room,
            isAvailable
        };
    });

    const availableRoomsDiv = document.getElementById("available-rooms");
    availableRoomsDiv.innerHTML = `
        <h3>Chambres Disponibles</h3>
        ${availableRooms.length > 0 
            ? availableRooms.map(room => `
                <div class="room">
                    <span><strong>Chambre:</strong> ${room.number}</span>
                    <span><strong>Type:</strong> ${room.type}</span>
                    <span><strong>Prix:</strong> €${room.price}</span>
                    ${room.isAvailable ? '' : '<span style="color: red; font-weight: bold;">❌ Non disponible pour les dates sélectionnées.</span>'}
                </div>
            `).join('')
            : "<p>Aucune chambre disponible pour les dates et filtres sélectionnés.</p>"}
    `;
}

// Fonction pour afficher un modal personnalisé
function showCustomModal(message) {
    const modal = document.createElement("div");
    modal.classList.add("custom-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(modal);

    // Close the modal when clicking on the close button
    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.remove();
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Ajouter une réservation avec un filtre de type de chambre
function showAddReservation() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Nouvelle Réservation</h2>
        <form id="add-reservation-form">
            <label for="name">Nom Complet:</label>
            <input type="text" id="name" required>
            
            <label for="arrival">Date d'arrivée:</label>
            <input type="date" id="arrival" required>
            
            <label for="departure">Date de départ:</label>
            <input type="date" id="departure" required>
            
            <label for="room-type">Type de Chambre:</label>
            <select id="room-type">
                <option value="Suite">Suite Présidentiel (€150 par nuit)</option>
                <option value="Double">Chambre Double (€80 par nuit)</option>
                <option value="Single">Chambre Single (€50 par nuit)</option>
            </select>
            
            <button type="submit">Réserver</button>
        </form>
    `;

    document.getElementById("add-reservation-form").addEventListener("submit", addReservation);
}

// Fonction pour ajouter une réservation et calculer le prix total
function addReservation(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const arrival = document.getElementById("arrival").value;
    const departure = document.getElementById("departure").value;
    const roomType = document.getElementById("room-type").value;

    if (new Date(arrival) >= new Date(departure)) {
        showCustomModal("⚠️ La date de départ doit être postérieure à la date d'arrivée. Merci de corriger vos dates.");
        return;
    }

    // Filtrer les chambres disponibles pour les dates et le type de chambre sélectionné
    const availableRooms = rooms.filter(room => 
        room.type === roomType && isRoomAvailableForDates(room.number, arrival, departure)
    );
    
    if (availableRooms.length === 0) {
        showCustomModal("❌ Aucune chambre disponible pour les dates et le type sélectionnés.");
        return;
    }

    // Sélectionner une chambre aléatoirement parmi les chambres disponibles
    const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];

    const daysDifference = Math.ceil((new Date(departure) - new Date(arrival)) / (1000 * 3600 * 24)); // Calcul du nombre de jours
    const totalPrice = randomRoom.price * daysDifference;

    // Ajouter la réservation
    reservations.push({ name, arrival, departure, room: randomRoom.number, price: totalPrice });
    showCustomModal(`✅ Réservation ajoutée avec succès! 
    \nNom: ${name}
    \nChambre: ${randomRoom.number} (${randomRoom.type})
    \nArrivée: ${arrival}
    \nDépart: ${departure}
    \nPrix Total: €${totalPrice}`);

    showReservations();
}

// Afficher les réservations actuelles
function showReservations() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Réservations actuelles</h2>
        ${reservations.length === 0 
            ? "<p>Aucune réservation trouvée.</p>" 
            : reservations.map(res => `
                <div class="room">
                    <span><strong>Nom:</strong> ${res.name}</span>
                    <span><strong>Chambre:</strong> ${res.room}</span>
                    <span><strong>Arrivée:</strong> ${res.arrival}</span>
                    <span><strong>Départ:</strong> ${res.departure}</span>
                    <span><strong>Prix Total:</strong> €${res.price}</span>
                </div>
            `).join('')}
    `;
}

// Annuler une réservation
function showCancelReservation() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Annuler la réservation</h2>
        <form id="cancel-reservation-form">
            <label for="cancel-name">Nom:</label>
            <input type="text" id="cancel-name" required>
            <button type="submit">Annuler la Reservation</button>
        </form>
    `;

    document.getElementById("cancel-reservation-form").addEventListener("submit", cancelReservation);
}

// Fonction pour annuler une réservation
function cancelReservation(e) {
    e.preventDefault();
    const name = document.getElementById("cancel-name").value;

    const index = reservations.findIndex(res => res.name === name);
    if (index !== -1) {
        reservations.splice(index, 1);
        showCustomModal(`✅ La réservation de ${name} a été annulée avec succès.`);
    } else {
        showCustomModal(`❌ Aucune réservation trouvée pour le nom "${name}". Veuillez vérifier et réessayer.`);
    }
    showReservations();
}

// Rechercher une réservation par nom
function showSearchReservation() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Rechercher une réservation</h2>
        <form id="search-reservation-form">
            <label for="search-name">Nom:</label>
            <input type="text" id="search-name" required>
            <button type="submit">Rechercher</button>
        </form>
        <div id="search-results"></div>
    `;

    document
        .getElementById("search-reservation-form")
        .addEventListener("submit", searchReservation);
}

// Fonction de recherche de réservation
function searchReservation(e) {
    e.preventDefault();
    const name = document.getElementById("search-name").value;

    const results = reservations.filter(res => res.name.toLowerCase() === name.toLowerCase());

    const searchResultsDiv = document.getElementById("search-results");
    searchResultsDiv.innerHTML = `
        <h3>Résultats de la recherche</h3>
        ${results.length > 0
            ? results.map(res => `
                <div class="room">
                    <span><strong>Nom:</strong> ${res.name}</span>
                    <span><strong>Chambre:</strong> ${res.room}</span>
                    <span><strong>Arrivée:</strong> ${res.arrival}</span>
                    <span><strong>Départ:</strong> ${res.departure}</span>
                    <span><strong>Prix Total:</strong> €${res.price}</span>
                </div>
            `).join('')
            : "<p>Aucune réservation trouvée pour le nom fourni.</p>"}
    `;
}

function showCustomModal(message) {
    const modal = document.createElement("div");
    modal.classList.add("custom-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(modal);

    // Ajouter la classe show pour afficher le modal avec animation
    setTimeout(() => modal.classList.add("show"), 10);

    // Close the modal when clicking on the close button
    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);  // Remove modal after transition
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Initialiser la page avec l'option de réservation
showAddReservation();
