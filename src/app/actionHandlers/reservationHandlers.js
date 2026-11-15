import { dispatch, getState } from '../../infra/store/store.js';
import { addReservationAction, cancelReservationAction } from '../actions/actions.js';
import { validateReservation, canCancelReservation, RESERVATION_STATES } from '../business/reservation.js';
import { apiCreateReservation, apiCancelReservation } from '../../api/api.js';
import { loadRoomsHandler } from './roomHandlers.js';

export const submitReservationHandler = async (roomId, requestedPersons) => {
    const state = getState();
    const room = state.rooms.find(r => r.id === roomId);
    const user = state.user;

    if (!user) { 
        alert('Pro vytvoření rezervace je nutné přihlášení.'); 
        return; 
    }
    
    if (!room) { 
        alert('Vybraný pokoj nebyl nalezen.'); 
        return; 
    }

    const validation = validateReservation(room, state.reservations, requestedPersons);

    if (!validation.isValid) {
        alert(`Rezervace zamítnuta: ${validation.error}`);
        return;
    }

    const newReservation = {
        roomId: room.id,
        userId: user.username,
        persons: requestedPersons,
        status: RESERVATION_STATES.CONFIRMED
    };

    try {
        const savedReservation = await apiCreateReservation(newReservation);

        dispatch(addReservationAction({
            ...savedReservation,
            userId: user.username, 
            roomId: room.id,       
            roomName: room.name 
        }));
        
        alert('Rezervace byla úspěšně uložena.');
        
        // Aktualizace kapacit pokojů po vytvoření rezervace
        await loadRoomsHandler(); 

    } catch (error) {
        console.error('Chyba při vytváření rezervace:', error);
        alert('Nepodařilo se uložit rezervaci. Zkontrolujte připojení k serveru.');
    }
};

export const cancelReservationHandler = async (reservation) => {
    const check = canCancelReservation(reservation);
    
    if (!check.isValid) {
        alert(check.error);
        return;
    }

    try {
        await apiCancelReservation(reservation.id);
        
        dispatch(cancelReservationAction(reservation.id));
        alert('Rezervace byla zrušena.');

        // Aktualizace kapacit pokojů po uvolnění místa
        await loadRoomsHandler();

    } catch (error) {
        console.error('Chyba při rušení rezervace:', error);
        alert('Nepodařilo se zrušit rezervaci. Zkuste to prosím znovu.');
    }
};