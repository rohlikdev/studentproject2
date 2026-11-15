import { dispatch } from '../../infra/store/store.js';
import { loginAction, setReservationsAction } from '../actions/actions.js';
import { apiFetchUserReservations } from '../../api/api.js';
import { navigateTo } from '../../infra/router/router.js';

export const loginHandler = async (username) => {
    if (!username) {
        return;
    }

    try {
        // data z API
        const reservations = await apiFetchUserReservations(username);
        
        // Až po úspěšném stažení aktualizuje se Store
        dispatch(loginAction(username));
        dispatch(setReservationsAction(reservations));
        
        //  Přesměrování na hlavní stranu
        navigateTo('/');
    } catch (error) {
        console.error('Chyba procesu přihlášení:', error);
        alert('Chyba při načítání dat z databáze. Přihlášení se nezdařilo.');
    }
};