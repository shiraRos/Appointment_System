import pool from './database.js';


export async function postProfessional(
    idProfessional,
    firstName,
    lastName,
    domainCode,
    startDate,
    address,
    cityCode,
    email,
    passwordProff,
    business_name,
    phone
) {
    try {
        const [result ] = await pool.query(
            `INSERT INTO professionals (idProfessional, firstName, lastName, domainCode, startDate, address, cityCode, email, passwordProff, business_name, phone) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idProfessional,
                firstName,
                lastName,
                domainCode,
                startDate,
                address,
                cityCode,
                email,
                passwordProff,
                business_name,
                phone
            ]
        );
        console.log(555 , result);
        return await getProfessionalById(insertId);;
    } catch (error) {
        throw new Error(`Error inserting professional: ${error.message}`);
    }
}


// פונקציה לשליפת ProfessionalServiceCode לפי serviceTypeCode ו-professionalId
export async function getProfessionalServiceCode(professionalId, serviceTypeCode) {
    const [rows] = await pool.query(`
        SELECT ProffServiceID
        FROM professional_services
        WHERE idProfessional = ? AND ServiceTypeCode = ?
    `, [professionalId, serviceTypeCode]);
    // בדיקה אם יש תוצאה לפני החילוץ
    if (rows.length > 0) {
        const { ProffServiceID } = rows[0];
        return ProffServiceID;
    } else {
        return null; // במידה ואין תוצאה
    }
}
//התחברות לבעל מקצוע
export const getProfessionalByEmailAndPassword = async (email, password) => {
    try {
        const query = 'SELECT * FROM professional_view WHERE email = ? AND passwordProff = ?';
        const [rows] = await pool.execute(query, [email, password]);
        if (rows.length > 0) {
            return rows[0]; // Return the first matching customer
        } else {
            return null; // No customer found
        }
    } catch (error) {
        console.error('Error fetching customer by email and password:', error);
    }
};



//קבלת כל בעלי המקצוע שיש להם את התחום המבוקש
export async function getProfessionalsByDomainAndType(field, type) {
    const query = `
        SELECT p.business_name, p.phone, c.cityName,t.typeCode,p.idProfessional
        FROM professionals p
        JOIN domains d ON p.domainCode = d.idDomain
        JOIN type_service t ON d.idDomain = t.domainCode
        JOIN cities c ON p.cityCode = c.cityCode
        WHERE d.domainName LIKE ?
        AND t.typeName LIKE ?
    `;
    const [professionals] = await pool.query(query, [`%${field}%`, `%${type}%`]);
    return professionals;
}

// Function to get all professionals
export async function getAllProfessionals() {
    const [professionals] = await pool.query(`
         SELECT idProfessional, firstName, lastName, domainCode, startDate, address, cityCode, email, business_name, phone 
         FROM professionals
    `);
    return professionals;
}

//קבלת כל שמות העסקים הרשומים בשרת
export async function getAllBuisnessNames() {
    const [business_names] = await pool.query(`
         SELECT business_name
         FROM professionals
    `);
    return business_names;
}

//קבלת מידע על העסק לפי השם שלו
export async function getProfessionalByName(name) {
    const [[professional]] = await pool.query(`
        SELECT p.idProfessional, p.firstName, p.lastName, p.domainCode, d.domainName,
        p.startDate, p.address, p.cityCode, p.email, p.business_name, p.phone, c.cityName
        FROM professionals p
        JOIN cities c ON p.cityCode = c.cityCode
        JOIN domains d ON p.domainCode = d.idDomain
        WHERE p.business_name = ?
    `, [name]);
    return professional;
}

//פונקציה המקבלת את כל פרטי בעל העסק עישם וסוג שרות
export async function getProfessionalDetails(businessName, serviceType) {
    const query = `
        SELECT p.business_name, p.firstName, p.lastName, p.phone, p.address, p.cityCode, c.cityName, ps.Duration, ps.Price
        FROM professionals p
        JOIN professional_services ps ON p.idProfessional = ps.idProfessional
        JOIN type_service ts ON ps.ServiceTypeCode = ts.typeCode
        JOIN cities c ON p.cityCode = c.cityCode
        WHERE p.business_name = ? AND ts.typeName = ?
    `;
    const [[details]] = await pool.query(query, [businessName, serviceType]);
    return details;
}
export async function getProfessionalById(id) {
    const [[professional]] = await pool.query(`SELECT * FROM professional_view WHERE idProfessional=?`, [id]);
   console.log(9999 , professional);
    return professional;
}
//פונקציה לעדכון פרטי לקוח

export async function updateProfessional(professionalID, professionalData) {
    const { firstName, lastName, domainCode, address, cityCode, email, business_name, phone } = professionalData;
    const query = `UPDATE professionals SET  firstName = ?, lastName = ?,domainCode= ? ,address = ?, cityCode = ? , email =? , business_name=? ,phone=? WHERE idProfessional = ?`;
    await pool.query(query, [firstName, lastName, domainCode, address, cityCode, email, business_name, phone, professionalID]);
    return await getProfessionalById(professionalID);
};


