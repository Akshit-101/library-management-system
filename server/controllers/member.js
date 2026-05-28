const pool = require('../db/db')

const getAllMembers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.*, ms.status AS membership_status
            FROM member_table m
            LEFT JOIN membership ms ON m.mem_id = ms.member_id
            ORDER BY m.mem_id DESC
        `)

        if (result) {
            return res.json(result.rows)
        } else {
            throw new Error("Issue Querying Data")
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const getMember = async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(`
            SELECT m.*, ms.status AS membership_status
            FROM member_table m
            LEFT JOIN membership ms ON m.mem_id = ms.member_id
            WHERE m.mem_id = $1
        `, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" })
        }

        return res.json(result.rows[0])

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const postMember = async (req, res) => {
    const { mem_name, mem_phone, mem_email, membership_status } = req.body;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const data = await client.query(
                'INSERT INTO member_table (mem_name, mem_phone, mem_email) VALUES ($1, $2, $3) RETURNING *',
                [mem_name, mem_phone, mem_email]
            );

            const newMember = data.rows[0];
            const status = membership_status || 'Active';

            await client.query(
                'INSERT INTO membership (member_id, status) VALUES ($1, $2)',
                [newMember.mem_id, status]
            );

            await client.query('COMMIT');

            const result = await pool.query(`
                SELECT m.*, ms.status AS membership_status
                FROM member_table m
                LEFT JOIN membership ms ON m.mem_id = ms.member_id
                WHERE m.mem_id = $1
            `, [newMember.mem_id]);

            return res.status(201).json(result.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateMember = async (req, res) => {
    const { mem_name, membership_status } = req.body
    const { id } = req.params

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const data = await client.query(
                'UPDATE member_table SET mem_name = $1 WHERE mem_id = $2 RETURNING *',
                [mem_name, id]
            );

            if (data.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: "Member not found" })
            }

            if (membership_status) {
                const check = await client.query('SELECT 1 FROM membership WHERE member_id = $1', [id]);
                if (check.rowCount > 0) {
                    await client.query('UPDATE membership SET status = $1 WHERE member_id = $2', [membership_status, id]);
                } else {
                    await client.query('INSERT INTO membership (member_id, status) VALUES ($1, $2)', [id, membership_status]);
                }
            }

            await client.query('COMMIT');

            const result = await pool.query(`
                SELECT m.*, ms.status AS membership_status
                FROM member_table m
                LEFT JOIN membership ms ON m.mem_id = ms.member_id
                WHERE m.mem_id = $1
            `, [id]);

            return res.status(200).json(result.rows[0])
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getAllMembers,
    getMember,
    postMember,
    updateMember
};