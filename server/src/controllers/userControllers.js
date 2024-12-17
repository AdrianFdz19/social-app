import pool from "../config/databaseConfig.js";

export const allUsers = async (req, res) => {
    try {   
        const query = await pool.query(`SELECT * FROM users`);
        const users = query.rows;

        res.status(200).json({
            users
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Error',
        })
    }
};

// user profile info
export const profileInfo = async (req, res) => {
    try {   
        const userId = req.params.userId;
        const query = await pool.query(`
            SELECT
                id,
                username, 
                email, 
                bio, 
                profile_picture_url,
                banner_picture_url,
                created_at,
                updated_at  
            FROM users WHERE id = $1    
        `, [userId]);
        const profileInfo = query.rows[0];

        res.status(200).json({
            profileInfo
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Error',
        })
    }
};