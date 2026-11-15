//Action Types
export const FETCH_ROOMS_START = 'FETCH_ROOMS_START';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_ERROR = 'FETCH_ROOMS_ERROR';

export const ADD_RESERVATION = 'ADD_RESERVATION';
export const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
export const SET_RESERVATIONS = 'SET_RESERVATIONS';

export const NAVIGATE = 'NAVIGATE';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';


//Action 
export const fetchRoomsStartAction = () => ({ 
    type: FETCH_ROOMS_START 
});

export const fetchRoomsSuccessAction = (rooms) => ({ 
    type: FETCH_ROOMS_SUCCESS, 
    payload: rooms 
});

export const fetchRoomsErrorAction = (errorMessage) => ({ 
    type: FETCH_ROOMS_ERROR, 
    payload: errorMessage 
});

export const addReservationAction = (reservationData) => ({
    type: ADD_RESERVATION,
    payload: reservationData
});

export const cancelReservationAction = (reservationId) => ({
    type: CANCEL_RESERVATION,
    payload: reservationId
});

export const setReservationsAction = (reservations) => ({
    type: SET_RESERVATIONS,
    payload: reservations
});

export const navigateAction = (path) => ({
    type: NAVIGATE,
    payload: path
});

export const loginAction = (username) => ({
    type: LOGIN,
    payload: { username }
});

export const logoutAction = () => ({
    type: LOGOUT
});