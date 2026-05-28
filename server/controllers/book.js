const pool = require('../db/db')

const getAllbooks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.*, c.cat_name, col.collection_name
            FROM book_table b
            LEFT JOIN category_table c ON b.book_cat_id = c.cat_id
            LEFT JOIN collection_table col ON b.book_collection_id = col.collection_id
            ORDER BY b.book_id DESC
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

const getbook = async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(`
            SELECT b.*, c.cat_name, col.collection_name
            FROM book_table b
            LEFT JOIN category_table c ON b.book_cat_id = c.cat_id
            LEFT JOIN collection_table col ON b.book_collection_id = col.collection_id
            WHERE b.book_id = $1
        `, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "book not found" })
        }

        return res.json(result.rows[0])

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const postbook = async (req, res) => {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body
    try {
        const data = await pool.query(
            'INSERT INTO book_table (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
        )


        const result = await pool.query(`
            SELECT b.*, c.cat_name, col.collection_name
            FROM book_table b
            LEFT JOIN category_table c ON b.book_cat_id = c.cat_id
            LEFT JOIN collection_table col ON b.book_collection_id = col.collection_id
            WHERE b.book_id = $1
        `, [data.rows[0].book_id])

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const updatebook = async (req, res) => {
    const { book_name } = req.body
    const { id } = req.params

    try {
        const data = await pool.query('UPDATE book_table SET book_name = $1 WHERE book_id = $2 RETURNING *', [book_name, id])

        if (data.rowCount === 0) {
            return res.status(404).json({ message: "book not found" })
        }

        const result = await pool.query(`
            SELECT b.*, c.cat_name, col.collection_name
            FROM book_table b
            LEFT JOIN category_table c ON b.book_cat_id = c.cat_id
            LEFT JOIN collection_table col ON b.book_collection_id = col.collection_id
            WHERE b.book_id = $1
        `, [id])

        return res.status(200).json(result.rows[0])

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM category_table ORDER BY cat_name ASC')
        return res.json(result.rows)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const getAllCollections = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM collection_table ORDER BY collection_name ASC')
        return res.json(result.rows)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getAllbooks,
    getbook,
    postbook,
    updatebook,
    getAllCategories,
    getAllCollections
}