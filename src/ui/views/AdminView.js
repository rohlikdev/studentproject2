import { getState } from '../../infra/store/store.js';
import { cancelReservationHandler } from '../../app/actionHandlers/reservationHandlers.js';
import { RESERVATION_STATES } from '../../app/business/reservation.js';

export const createAdminView = () => {
    const state = getState();
    const container = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = 'Administrace - Všechny rezervace';
    container.appendChild(title);

    if (state.reservations.length === 0) {
        const noRes = document.createElement('p');
        noRes.textContent = 'V systému nejsou žádné rezervace.';
        container.appendChild(noRes);
        return container;
    }

    const list = document.createElement('ul');

    state.reservations.forEach(res => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.style.padding = '10px';

        const textContent = document.createElement('div');
        
        const userStrong = document.createElement('strong');
        userStrong.textContent = `Uživatel: ${res.userId}`;
        textContent.appendChild(userStrong);

        const restOfText = document.createTextNode(` | Pokoj: ${res.roomName || res.roomId} | Osob: ${res.persons} | Stav: ${res.status}`);
        textContent.appendChild(restOfText);

        li.appendChild(textContent);

        if (res.status === RESERVATION_STATES.CONFIRMED) {
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Zrušit rezervaci (Admin)';
            cancelBtn.style.marginTop = '5px';
            cancelBtn.style.padding = '0.2rem 0.6rem';
            
            cancelBtn.addEventListener('click', () => {
                const confirmed = confirm(`Opravdu chcete zrušit rezervaci uživatele ${res.userId}?`);
                if (confirmed) {
                    cancelReservationHandler(res);
                }
            });
            li.appendChild(cancelBtn);
        }

        list.appendChild(li);
    });

    container.appendChild(list);

    return container;
};