import { dispatch } from '../store/store.js';
import { navigateAction } from '../../app/actions/actions.js';

/**
 * Programová změna URL a vyvolání akce
 */
export const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    dispatch(navigateAction(window.location.pathname));
};

export const initRouter = () => {
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-link]');
        
        if (link) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });

    window.addEventListener('popstate', () => {
        dispatch(navigateAction(window.location.pathname));
    });
};

