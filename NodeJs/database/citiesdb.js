import pool from './database.js'

//פונקציה המחזירה את כל הערים הקיימים בשרת
export async function getCities() {
    const [cities] = await pool.query(`SELECT * FROM cities `);
    return cities;
}


//פונקציה המחזירה לקוח לפי מספר זהות
export async function getCityById(id) {
    const [[city]] = await pool.query(`select cityName from cities where cityCode=?`, [id]);
    return city;
}

//פונקציה המוסיפה לקוח חדשה
export async function postCity(cityName) {
    const [{ insertId }] = await pool.query(`insert into cities( cityName) VALUES (?)`, [cityName]);
    return await getCustomer(insertId);
}


//פונקציה לעדכון פרטי לקוח
export const updateCity = async (cityCode, cityData) => {
    const { cityName } = cityData;
    const query = 'UPDATE cities SET cityName = ? WHERE cityCode = ?';
    await pool.query(query, [cityName, cityCode]);
};

