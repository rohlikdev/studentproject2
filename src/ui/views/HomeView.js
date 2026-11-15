import { getState } from '../../infra/store/store.js';
import { loadRoomsHandler } from '../../app/actionHandlers/roomHandlers.js';
import { navigateTo } from '../../infra/router/router.js';

export const createHomeView = () => {
    const state = getState();
    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Rezervační systém pro pokoje (KIT-TNPW2 - semestrální projekt)';
    title.style.paddingBottom='40px';
    container.appendChild(title);

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Načíst pokoje z databáze';
    loadBtn.style.marginBottom = '20px';
    loadBtn.style.width = 'auto';
    loadBtn.addEventListener('click', () => loadRoomsHandler());
    container.appendChild(loadBtn);

    const availableRooms = state.rooms.filter(r => r.status === 'AVAILABLE');
    const totalCapacity = availableRooms.reduce((sum, room) => {
        const free = room.capacity - (room.booked || 0);
        return sum + (free > 0 ? free : 0);
    }, 0);

    const subtitle = document.createElement('h3');
    subtitle.textContent = `Dostupné pokoje pro: ${totalCapacity} osob`;
    container.appendChild(subtitle);

    if (state.rooms.length === 0) {
        const noRooms = document.createElement('p');
        noRooms.textContent = 'V tuhle chvíli nejsou načteny žádné pokoje. Klikněte na modré tlačítko výše "Načíst pokoje ze serveru".';
        container.appendChild(noRooms);
        return container;
    }

    const list = document.createElement('ul');
    
    state.rooms.forEach(room => {
        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        li.style.listStyleType = 'circle';
        const available = room.capacity - (room.booked || 0);
        const textSpan = document.createElement('span');

        if (room.status === 'MAINTENANCE') {
            textSpan.textContent = `${room.name} (Volno: ${available} z ${room.capacity} míst) - ${room.status} `;
            li.appendChild(textSpan);
        } else {
            textSpan.textContent = ` ${room.name} (Volno: ${available} z ${room.capacity} míst) `;
            li.appendChild(textSpan);

            if (state.user) {
                if (available > 0) {
                    const bookBtn = document.createElement('button');
                    bookBtn.textContent = 'Rezervovat';
                    bookBtn.style.display = 'inline-block';
                    bookBtn.style.marginLeft = '15px';
                    bookBtn.style.padding = '0.2rem 1rem';
                    
                    bookBtn.addEventListener('click', () => navigateTo('/rezervace'));
                    li.appendChild(bookBtn);
                } else {
                    const fullHint = document.createElement('strong');
                    fullHint.textContent = ' (Vyprodáno)';
                    fullHint.style.color = 'red';
                    fullHint.style.marginLeft = '15px';
                    li.appendChild(fullHint);
                }
            } 
            else {
                    const loginHint = document.createElement('small');
                    loginHint.textContent = ' (Pro rezervaci se musíte přihlásit)';
                    loginHint.style.color = '#888';
                    loginHint.style.marginLeft = '10px';
                    li.appendChild(loginHint);
            }
            
            }

        list.appendChild(li);
    });
    
    container.appendChild(list);

    return container;
};