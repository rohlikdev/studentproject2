import { navigateTo } from '../../infra/router/router.js';

export const createNotFoundView = () => {
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.padding = '50px 20px';

    const title = document.createElement('h2');
    title.textContent = '404 - Stránka nenalezena';
    container.appendChild(title);

    const message = document.createElement('p');
    message.textContent = 'Neexistující URL Prosím, vraťte se na Home.';
    container.appendChild(message);

    const homeBtn = document.createElement('button');
    homeBtn.textContent = 'Zpět';
    homeBtn.style.marginTop = '20px';
    
    homeBtn.addEventListener('click', () => {
        navigateTo('/');
    });
    
    container.appendChild(homeBtn);

    return container;
};