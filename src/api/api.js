const API_URL = 'http://localhost:3000/api';

const fetchApi = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status} na endpointu ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Chyba API komunikace (${endpoint}):`, error);
        throw error;
    }
};

// Načtení všech pokojů
export const apiFetchRooms = () => {
    return fetchApi('/rooms');
};

// Vytvoření nové rezervace
export const apiCreateReservation = (reservationData) => {
    return fetchApi('/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    });
};

// Stažení existujících rezervací uživatele
export const apiFetchUserReservations = (userId) => {
    return fetchApi(`/reservations?userId=${encodeURIComponent(userId)}`);
};

// Zrušení rezervace aktualizace stavu na CANCELLED
export const apiCancelReservation = (reservationId) => {
    return fetchApi(`/reservations/${encodeURIComponent(reservationId)}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'CANCELLED' })
    });
};