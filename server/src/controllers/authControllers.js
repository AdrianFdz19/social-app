import pool from '../config/databaseConfig.js';

export const testDatabase = async (req, res) => {
    const query = await pool.query(`SELECT * FROM NOW()`);
    const data = query.rows[0];
    res.status(200).json(data);
};