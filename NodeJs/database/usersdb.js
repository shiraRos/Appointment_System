import pool from './database.js'

//פונקציה המחזירה את כל המשתמשים
export async function getUsers() {
    const [users] = await pool.query('select * from users where isActive=1');
    return users;
}

//פונקציה המחזירה משתמש לפי מספר זהות
export async function getUser(id) {
    const [[user]] = await pool.query(`select * from users where id=? and isActive=1`, [id]);
    return user;
}

//פונקציה המוסיפה משתמש קיים
export const getUserByUsernameAndPassword = async (username, password) => {
    try {
        const query = `
            SELECT u.id,u.name, u.userName, u.email,u.address, u.phone
            FROM users u
            INNER JOIN passwords p ON u.id = p.userId
            WHERE u.username = ? AND p.password = ?
        `;
        const [rows, fields] = await pool.execute(query, [username, password]);
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

//פונקציה המוסיפה משתמש חדש
export async function postUser(name, userName, email, address, phone) {
    const [{ insertid }] = await pool.query(`insert into users(name,userName,email,address,phone, isActive) VALUES (?,?,?,?,?,1)`, [name, userName, email, address, phone]);
    return await getUser(insertid);
}

//פונקציה לעדכון פרטי משתמש
export const updateUser = async (userID, userData) => {
    const { name, userName, email, address, phone } = userData;
    const query = 'UPDATE users SET name = ?, userName = ?, email = ?, address = ?, phone=? WHERE id = ?';
    await pool.query(query, [name, userName, email, address, phone, userID]);
};

export const DeleteUser = async (userID) => {
    const query = 'UPDATE users SET isActive = 0 WHERE id = ?';
    await pool.query(query, [userID]);
};