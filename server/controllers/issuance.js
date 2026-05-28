const pool = require('../db/db')

const getAllissuances = async (req, res) => {

    try{
        const result = await pool.query(`
            SELECT 
                i.issuance_id, 
                i.issuance_member,    
                i.issuance_date, 
                i.issued_by, 
                i.issuance_status, 
                i.target_return_date,
                i.actual_return_date,
                b.book_name, 
                m.mem_name 
            FROM issuance_table i 
            JOIN book_table b ON i.book_id = b.book_id 
            JOIN member_table m ON i.issuance_member = m.mem_id
        `);
        if (result){
            return res.json(result.rows)
        }else{
            throw new Error("Issue Querying Data")
        }
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
}

const getissuance = async (req,res) => {
    try{
        const { id } = req.params

        const result = await pool.query('SELECT * FROM issuance_table WHERE issuance_id = $1', [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "issuance not found" })
        }

        return res.json(result.rows[0])

    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

const postissuance = async (req, res) => {
    const { book_id, issuance_member, target_return_date, issued_by } = req.body
    try{
        const data = await pool.query('INSERT INTO issuance_table (book_id, issuance_member, target_return_date, issued_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [book_id, issuance_member, target_return_date, issued_by]
        )
        return res.status(201).json(data.rows[0]);
    }catch(err){
        return res.status(500).json({ error: err.message });
    }
};

const updateissuance =  async(req,res) => {
    const {issuance_status,actual_return_date} = req.body
    const {id} = req.params

    try {

        const data = await pool.query('UPDATE issuance_table SET issuance_status = $1, actual_return_date = $2 WHERE issuance_id = $3 RETURNING *',[issuance_status,actual_return_date,id]) 

        if (data.rowCount === 0) {
            return res.status(404).json({ message: "issuance not found" })
        }
        return res.status(200).json(data.rows)

    } catch ( err ) {
        return res.json({error : err.message})
    }

}

module.exports = { 
    getAllissuances, 
    getissuance, 
    postissuance, 
    updateissuance 
};