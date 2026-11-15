// Získání všech pokojů
//export const selectAllRooms = (state) => state.rooms || [];

// Filtrování pouze pokojů se statusem AVAILABLE
export const selectAvailableRooms = (state) => 
    (state.rooms || []).filter(room => room.status === 'AVAILABLE');

/* data z databáze o obsazenosti
export const selectTotalAvailableCapacity = (state) => {
    const availableRooms = selectAvailableRooms(state);
    return availableRooms.reduce((sum, room) => {
        const free = room.capacity - (room.booked || 0);
        return sum + (free > 0 ? free : 0);
    }, 0);
};
*/
// Kontrola existence dat
//export const selectHasRooms = (state) => (state.rooms || []).length > 0;