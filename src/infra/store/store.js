import { 
    ADD_RESERVATION, 
    NAVIGATE, 
    FETCH_ROOMS_START, 
    FETCH_ROOMS_SUCCESS, 
    FETCH_ROOMS_ERROR, 
    LOGIN, 
    LOGOUT,
    CANCEL_RESERVATION,
    SET_RESERVATIONS 
} from '../../app/actions/actions.js';

// Výchozí stav aplikace. Definuje strukturu dat, se kterými aplikace pracuje
let state = {
    currentPath: window.location.pathname, 
    user: null,                            
    rooms: [],                             
    reservations: [],                      
    isLoading: false,                      
    error: null                            
};

const listeners = [];

export const getState = () => state;

export const subscribe = (listener) => {
    listeners.push(listener);
};

// Dispatcher 
export const dispatch = (action) => {
    switch (action.type) {
        
        case ADD_RESERVATION:
            state = {
                ...state,
                reservations: [
                    ...state.reservations,     
                    action.payload 
                ]
            };
            break;

        // Aktualizuje aktuální URL adresu ve stavu
        case NAVIGATE:
            state = {
                ...state,
                currentPath: action.payload
            };
            break;

        case FETCH_ROOMS_START:
            state = { ...state, isLoading: true, error: null };
            break;

        case FETCH_ROOMS_SUCCESS:
            state = { ...state, isLoading: false, rooms: action.payload };
            break;

        case FETCH_ROOMS_ERROR:
            state = { ...state, isLoading: false, error: action.payload };
            break;

        case LOGIN:
            state = { ...state, user: action.payload };
            break;

        case LOGOUT:
            state = { ...state, user: null };
            break;

        case CANCEL_RESERVATION:
            state = {
                ...state,
                reservations: state.reservations.map(res => 
                    res.id === action.payload 
                        ? { ...res, status: 'CANCELLED' } 
                        : res
                )
            };
            break;

        // Hvložení rezervací uživatele při loginu
        // Zároveň transformuje názvy sloupců z databáze (snake_case) na formát JavaScriptu (camelCase)
        case SET_RESERVATIONS:
            state = {
                ...state,
                reservations: action.payload.map(res => ({
                    ...res,
                    userId: res.user_id, 
                    roomId: res.room_id,
                    roomName: res.roomName
                }))
            };
            break;

        default:
            return; 
    }

    listeners.forEach(listener => listener(state));
};