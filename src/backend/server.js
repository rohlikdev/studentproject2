const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rezervace_db',
    password: '976151', 
    port: 5432,
});

const sendJson = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Neplatný formát JSON.'));
            }
        });
        req.on('error', reject);
    });
};

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return; 
    }

    try {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const pathname = urlObj.pathname;

        if (pathname === '/api/rooms' && req.method === 'GET') {
            const result = await pool.query(`
                SELECT r.*, 
                COALESCE((SELECT SUM(persons) FROM reservations WHERE room_id = r.id AND status = 'CONFIRMED'), 0)::int AS booked
                FROM rooms r ORDER BY id ASC
            `);
            return sendJson(res, 200, result.rows);
        }
        
        if (pathname === '/api/reservations' && req.method === 'GET') {
            const userId = urlObj.searchParams.get('userId');
            if (!userId) return sendJson(res, 400, { error: 'Chybí parametr userId.' });

            let result;
            
            // Pokud je uživatel admin jinak jen jeho rezervace.
            if (userId === 'admin') {
                result = await pool.query(
                    'SELECT r.*, rm.name as "roomName" FROM reservations r JOIN rooms rm ON r.room_id = rm.id ORDER BY r.id DESC'
                );
            } else {
                result = await pool.query(
                    'SELECT r.*, rm.name as "roomName" FROM reservations r JOIN rooms rm ON r.room_id = rm.id WHERE r.user_id = $1 ORDER BY r.id DESC',
                    [userId]
                );
            }
            
            return sendJson(res, 200, result.rows);
        }

        if (pathname === '/api/reservations' && req.method === 'POST') {
            const data = await parseBody(req);
            const { roomId, userId, persons, status } = data;

            if (!roomId || !userId || !persons || !status) {
                return sendJson(res, 400, { error: 'Neúplná data požadavku.' });
            }

            // Kontrola kapacity  
            const checkResult = await pool.query(`
                SELECT capacity, 
                COALESCE((SELECT SUM(persons) FROM reservations WHERE room_id = $1 AND status = 'CONFIRMED'), 0)::int AS booked
                FROM rooms WHERE id = $1
            `, [roomId]);

            if (checkResult.rows.length === 0) {
                return sendJson(res, 404, { error: 'Zvolený pokoj neexistuje.' });
            }

            const room = checkResult.rows[0];
            const available = room.capacity - room.booked;

            if (persons > available) {
                return sendJson(res, 400, { error: `Kapacita překročena. Volná místa: ${available}` });
            }

            // Uložení rezervace
            const result = await pool.query(
                'INSERT INTO reservations (room_id, user_id, persons, status) VALUES ($1, $2, $3, $4) RETURNING *',
                [roomId, userId, persons, status]
            );
            return sendJson(res, 201, result.rows[0]);
        } 
        
        const patchMatch = pathname.match(/^\/api\/reservations\/(\d+)$/);
        if (patchMatch && req.method === 'PATCH') {
            const id = patchMatch[1];
            const data = await parseBody(req);

            if (!data.status) {
                return sendJson(res, 400, { error: 'Chybí nový status rezervace.' });
            }

            const result = await pool.query(
                'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
                [data.status, id]
            );

            if (result.rowCount === 0) {
                 return sendJson(res, 404, { error: 'Rezervace nenalezena.' });
            }

            return sendJson(res, 200, result.rows[0]);
        }
        
        return sendJson(res, 404, { error: 'Endpoint nenalezen.' });

    } catch (err) {
        console.error('Chyba serveru:', err);
        return sendJson(res, 500, { error: 'Vnitřní chyba serveru.' });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Backend server se spustil,`);
    console.log(`Pokračujte v Live serveru.`);

});