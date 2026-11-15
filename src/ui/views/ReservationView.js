import { getState } from '../../infra/store/store.js';
import { submitReservationHandler, cancelReservationHandler } from '../../app/actionHandlers/reservationHandlers.js';
import { selectAvailableRooms } from '../../app/selectors/roomSelectors.js';
import { RESERVATION_STATES } from '../../app/business/reservation.js';

export const createReservationView = () => {
    const state = getState();
    const container = document.createElement('div');
    container.className = 'reservation-container';

    const title = document.createElement('h2');
    title.textContent = 'Nová rezervace';
    container.appendChild(title);

    const form = document.createElement('form');
    form.style.padding = '15px';
    form.style.marginBottom = '30px';

    const roomSelect = document.createElement('select');
    roomSelect.required = true;
    
    const defaultOption = document.createElement('option');
    defaultOption.textContent = '- Vyberte pokoj -';
    defaultOption.value = '';
    roomSelect.appendChild(defaultOption);

    const availableRooms = selectAvailableRooms(state);
    
    availableRooms.forEach(room => {
        const available = room.capacity - (room.booked || 0);
        if (available > 0) {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.name} (Volno: ${available} z ${room.capacity})`;
            roomSelect.appendChild(option);
        }
    });
    form.appendChild(roomSelect);

    const personsInput = document.createElement('input');
    personsInput.type = 'number';
    personsInput.placeholder = 'Počet osob';
    personsInput.min = '1';
    personsInput.required = true;
    form.appendChild(personsInput);

    //  omezení vstupu podle vybraného pokoje
    roomSelect.addEventListener('change', () => {
        const selectedRoomId = parseInt(roomSelect.value, 10);
        const room = availableRooms.find(r => r.id === selectedRoomId);
        
        if (room) {
            const available = room.capacity - (room.booked || 0);
            personsInput.max = available; 
            personsInput.placeholder = `Max. ${available} osob`;
            
            if (parseInt(personsInput.value, 10) > available) {
                personsInput.value = available;
            }
        } else {
            personsInput.removeAttribute('max');
            personsInput.placeholder = 'Počet osob';
        }
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Zarezervovat';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedRoomId = parseInt(roomSelect.value, 10);
        const personsCount = parseInt(personsInput.value, 10);

        if (selectedRoomId && personsCount) {
            submitReservationHandler(selectedRoomId, personsCount);
        }
    });

    container.appendChild(form);

    //Výpis uživatelských rezervací
    const listTitle = document.createElement('h3');
    listTitle.textContent = `Moje rezervace (${state.user.username})`;
    container.appendChild(listTitle);

    const userReservations = state.reservations.filter(res => res.userId === state.user.username);
    
    if (userReservations.length === 0) {
        const noRes = document.createElement('p');
        noRes.textContent = 'Zatím nemáte žádné rezervace.';
        container.appendChild(noRes);
        return container; 
    }

    const list = document.createElement('ul');

    userReservations.forEach(res => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';

        const textContent = document.createElement('span');
        
        const strongText = document.createElement('strong');
        strongText.textContent = res.roomName || `Pokoj ID: ${res.roomId}`;
        textContent.appendChild(strongText);
        
        const infoText = document.createTextNode(` | Osob: ${res.persons} | Stav: ${res.status}`);
        textContent.appendChild(infoText);
        
        li.appendChild(textContent);

        if (res.status === RESERVATION_STATES.CONFIRMED) {
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Zrušit';
            cancelBtn.style.marginLeft = '15px';
            cancelBtn.style.padding = '0.2rem 0.6rem';
            
            cancelBtn.addEventListener('click', () => {
                cancelReservationHandler(res);
            });
            li.appendChild(cancelBtn);
        }

        list.appendChild(li);
    });

    container.appendChild(list);

    return container;
};