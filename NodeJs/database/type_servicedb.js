import pool from './database.js';

// פונקציה המחזירה את כל סוגי הטיפול
export async function getType_services() {
    const [type_services] = await pool.query(`
        SELECT typeName FROM type_service
    `);
    return type_services;
}
//פונקציה שמחזירה את כל סוגי התת תחום לפי מזהה תחום
export async function getType_serviceById(id) {
    const [type_service] = await pool.query(`
        SELECT typeCode, typeName, domainCode 
        FROM type_service 
        WHERE domainCode = ?
    `, [id]);
    return type_service;
}

// פונקציה המוסיפה סוג טיפול חדש
export async function postType_service(typeName, domainCode) {
    const [{ insertId }] = await pool.query(`
        INSERT INTO type_service(typeName, domainCode) 
        VALUES (?, ?)
    `, [typeName, domainCode]);
    return await getType_serviceById(insertId);
}

// פונקציה למחיקת סוג טיפול לפי מספר זיהוי
export async function deleteType_service(typeCode) {
    await pool.query(`DELETE FROM type_service WHERE typeCode = ?`, [typeCode]);
}

// פונקציה לעדכון פרטי סוג טיפול
export async function updateType_service(typeCode, type_serviceData) {
    const { typeName, domainCode } = type_serviceData;
    const query = `
        UPDATE type_service 
        SET typeName = ?, domainCode = ? 
        WHERE typeCode = ?
    `;
    await pool.query(query, [typeName, domainCode, typeCode]);
}

// פונקציה המחזירה סוגי טיפול לפי תחום
export async function getType_servicesByDomain(domainName) {
    const query = `
    SELECT ts.typeName 
    FROM type_service ts
    JOIN domains d ON ts.domainCode = d.idDomain
    WHERE d.domainName = ?
`;
    const [type_services] = await pool.query(query, [domainName]);
    return type_services;
}