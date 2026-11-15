export const RESERVATION_STATES = Object.freeze({
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
});

/*
  Validuje, zda je možné vytvořit rezervaci pro daný pokoj
 */
export const validateReservation = (room, requestedPersons) => {
    if (room.status === 'MAINTENANCE') {
        return { 
            isValid: false, 
            error: 'Pokoj je momentálně v údržbě.' 
        };
    }

    const available = room.capacity - (room.booked || 0);

    if (requestedPersons > available) {
        return { 
            isValid: false, 
            error: `Kapacita překročena. Volná místa: ${available}.` 
        };
    }

    return { 
        isValid: true, 
        error: null 
    };
};

/*
  Validuje, zda je možné existující rezervaci zrušit
 */
export const canCancelReservation = (reservation) => {
    if (reservation.status === RESERVATION_STATES.CANCELLED) {
        return { 
            isValid: false, 
            error: 'Rezervace je již zrušena.' 
        };
    }
    
    if (reservation.status === RESERVATION_STATES.COMPLETED) {
        return { 
            isValid: false, 
            error: 'Dokončenou rezervaci nelze zrušit.' 
        };
    }

    return { 
        isValid: true, 
        error: null 
    };
};