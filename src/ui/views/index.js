import { subscribe, getState, dispatch } from '../../infra/store/store.js';
import { initRouter, navigateTo } from '../../infra/router/router.js';
import { logoutAction } from '../../app/actions/actions.js';
import { createReservationView } from './ReservationView.js';
import { createHomeView } from './HomeView.js';
import { createLoginView } from './LoginView.js';
import { createNotFoundView } from './NotFoundView.js'; 
import { createAdminView } from './AdminView.js'; 

const appRoot = document.getElementById('app');
appRoot.className = 'container';


 // přihlášení
 
const createNavigation = (state) => {
    const nav = document.createElement('nav');
    nav.style.display = 'flex';
    nav.style.gap = '20px';
    nav.style.alignItems = 'center';
    nav.style.marginBottom = '20px';
    
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.setAttribute('data-link', '');
    homeLink.textContent = 'Home';
    nav.appendChild(homeLink);

    if (state.user) {
        const resLink = document.createElement('a');
        resLink.href = '/rezervace';
        resLink.setAttribute('data-link', '');
        resLink.textContent = 'Správa rezervací';
        nav.appendChild(resLink);

        // administrátor
        if (state.user.username === 'admin') {
            const adminLink = document.createElement('a');
            adminLink.href = '/admin';
            adminLink.setAttribute('data-link', '');
            adminLink.textContent = 'Administrace';
            adminLink.style.color = 'red';
            nav.appendChild(adminLink);
        }

        const userInfo = document.createElement('span');
        userInfo.textContent = `Přihlášen jako: ${state.user.username}`;
        nav.appendChild(userInfo);

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Odhlásit';
        logoutBtn.style.padding = '0.2rem 1rem';
        
        logoutBtn.addEventListener('click', () => {
            dispatch(logoutAction());
            navigateTo('/login');
        });
        nav.appendChild(logoutBtn);
    } else {
        const loginLink = document.createElement('a');
        loginLink.href = '/login';
        loginLink.setAttribute('data-link', '');
        loginLink.textContent = 'Přihlásit se';
        nav.appendChild(loginLink);
    }
    
    return nav;
};

/**
 * vykreslování
 */
const render = () => {
    while (appRoot.firstChild) {
        appRoot.removeChild(appRoot.firstChild);
    }
    
    const state = getState();
    appRoot.appendChild(createNavigation(state));
    appRoot.appendChild(document.createElement('hr'));

    // Routing   
    if (state.currentPath === '/rezervace') {
        if (!state.user) {
            navigateTo('/login');
            return; 
        }
        appRoot.appendChild(createReservationView());
    } else if (state.currentPath === '/admin') {
        if (!state.user || state.user.username !== 'admin') {
            navigateTo('/');
            return;
        }
        appRoot.appendChild(createAdminView());
    
    } else if (state.currentPath === '/login') {
        appRoot.appendChild(createLoginView());
    } else if (state.currentPath === '/') {
        // hlavní stránka
        appRoot.appendChild(createHomeView());
    } else {
        // neexistující URL
        appRoot.appendChild(createNotFoundView());
    }
};

subscribe(render);
initRouter();
render();