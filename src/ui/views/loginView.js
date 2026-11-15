import { loginHandler } from '../../app/actionHandlers/authHandlers.js';

export const createLoginView = () => {
    const container = document.createElement('div');
    container.className = 'login-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Přihlášení';
    container.appendChild(title);

    const form = document.createElement('form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const username = usernameInput.value.trim();
        
        if (username) {
            loginHandler(username); 
        } else {
            alert('Zadejte přihlašovací jméno.');
        }
    });

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Zadejte své ID (např. "user" nebo "admin")';
    usernameInput.required = true;
    form.appendChild(usernameInput);

    const loginBtn = document.createElement('button');
    loginBtn.type = 'submit';
    loginBtn.textContent = 'Přihlásit se';
    form.appendChild(loginBtn);
    
    container.appendChild(form);

    return container;
};