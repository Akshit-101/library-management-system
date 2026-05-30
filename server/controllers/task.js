const pool = require('../db/db')

const getNeverBorrowed = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.book_name AS book_name,
                b.book_author AS author
            FROM book_table b
            LEFT JOIN issuance_table i ON b.book_id = i.book_id
            WHERE i.issuance_id IS NULL
            ORDER BY b.book_id DESC
        `);
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getOutstanding = async (req, res) => {
    try {
        const { date } = req.query;

        let result;
        if (date) {
            result = await pool.query(`
                SELECT 
                    m.mem_name AS member_name,
                    b.book_name AS book_name,
                    i.issuance_date AS issued_date,
                    i.target_return_date AS target_return_date,
                    b.book_author AS author
                FROM issuance_table i
                JOIN book_table b ON i.book_id = b.book_id
                JOIN member_table m ON i.issuance_member = m.mem_id
                WHERE i.issuance_date::date <= $1::date
                  AND (i.actual_return_date IS NULL OR i.actual_return_date > $1::date)
                ORDER BY i.issuance_id DESC
            `, [date]);
        } else {
            result = await pool.query(`
                SELECT 
                    m.mem_name AS member_name,
                    b.book_name AS book_name,
                    i.issuance_date AS issued_date,
                    i.target_return_date AS target_return_date,
                    b.book_author AS author
                FROM issuance_table i
                JOIN book_table b ON i.book_id = b.book_id
                JOIN member_table m ON i.issuance_member = m.mem_id
                WHERE i.issuance_status IN ('Issued', 'Overdue')
                  AND i.actual_return_date IS NULL
                ORDER BY i.issuance_id DESC
            `);
        }
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getTopBorrowed = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.book_name AS book_name,
                COUNT(i.issuance_id)::int AS borrow_count,
                COUNT(DISTINCT i.issuance_member)::int AS unique_borrowers
            FROM book_table b
            JOIN issuance_table i ON b.book_id = i.book_id
            GROUP BY b.book_id, b.book_name
            ORDER BY borrow_count DESC, unique_borrowers DESC
            LIMIT 10
        `);
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getNeverBorrowed,
    getOutstanding,
    getTopBorrowed
};
