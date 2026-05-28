const pool = require('../db/db')

const getAllbooks = async (req, res) => {

    try{
        const result = await pool.query('SELECT * FROM book_table')

        if (result){
            return res.json(result.rows)
        }else{
            throw new Error("Issue Querying Data")
        }
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
}

const getbook = async (req,res) => {
    try{
        const { id } = req.params

        const result = await pool.query('SELECT * FROM book_table WHERE book_id = $1', [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "book not found" })
        }

        return res.json(result.rows[0])

    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

const postbook = async (req, res) => {
    const {book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher} = req.body
    try{
        const data = await pool.query('INSERT INTO book_table (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
        )
        return res.status(201).json(data.rows[0]);
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const updatebook =  async(req,res) => {
    const {book_name} = req.body
    const {id} = req.params

    try {

        const data = await pool.query('UPDATE book_table SET book_name = $1 WHERE book_id = $2 RETURNING *',[book_name,id]) 

        if (data.rowCount === 0) {
            return res.status(404).json({ message: "book not found" })
        }
        return res.status(200).json(data.rows)

    } catch ( err ) {
        return res.json({error : err.message})
    }

}

module.exports = { 
    getAllbooks, 
    getbook, 
    postbook, 
    updatebook 
};