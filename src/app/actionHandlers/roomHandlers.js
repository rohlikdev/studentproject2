import { dispatch } from '../../infra/store/store.js';
import { 
    fetchRoomsStartAction, 
    fetchRoomsSuccessAction, 
    fetchRoomsErrorAction 
} from '../actions/actions.js';
import { apiFetchRooms } from '../../api/api.js';


 //Zajišťuje stažení seznamu pokojů z API a aktualizaci stavu aplikace
 
export const loadRoomsHandler = async () => {
    dispatch(fetchRoomsStartAction());

    try {
        const rooms = await apiFetchRooms();
        
        if (!Array.isArray(rooms)) {
            throw new Error('API nevrátilo platné pole pokojů.');
        }

        dispatch(fetchRoomsSuccessAction(rooms));
    } catch (error) {
        console.error('Selhalo načítání pokojů:', error);
        dispatch(fetchRoomsErrorAction(error));
    }
};