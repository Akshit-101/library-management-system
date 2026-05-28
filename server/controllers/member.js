const pool = require('../db/db')

const getAllMembers = async (req, res) => {

    try{
        const result = await pool.query('SELECT * FROM member_table')

        if (result){
            return res.json(result.rows)
        }else{
            throw new Error("Issue Querying Data")
        }
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
}

const getMember = async (req,res) => {
    try{
        const { id } = req.params

        const result = await pool.query('SELECT * FROM member_table WHERE mem_id = $1', [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" })
        }

        return res.json(result.rows[0])

    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

const postMember = async (req, res) => {
    const { mem_name, mem_phone, mem_email } = req.body;

    try {
        const data = await pool.query('INSERT INTO member_table (mem_name, mem_phone, mem_email) VALUES ($1, $2, $3) RETURNING *', [mem_name, mem_phone, mem_email]);
        
        return res.status(201).json(data.rows[0]);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateMember =  async(req,res) => {
    const {mem_name} = req.body
    const {id} = req.params

    try{
        const data = await pool.query('UPDATE member_table SET mem_name = $1 WHERE mem_id = $2 RETURNING *',[mem_name,id])
        if (data.rowCount === 0) {
            return res.status(404).json({ message: "Member not found" })
        }
        return res.status(200).json(data.rows)
    }catch(err){
        return res.json({error : err.message})
    }
}

module.exports = { 
    getAllMembers, 
    getMember, 
    postMember, 
    updateMember 
};