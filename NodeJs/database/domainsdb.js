import pool from './database.js';

// פונקציה המחזירה את כל התחומים
export async function getDomains() {
    const [domains] = await pool.query(`
        SELECT * FROM domains
    `);
    return domains;
}

// פונקציה המחזירה תחום לפי מספר זהות
export async function getDomain(domainCode) {
    const [[domain]] = await pool.query(`
        SELECT domainName 
        FROM domains 
        WHERE idDomain = ?
    `, [domainCode]);
    return domain;
}

// פונקציה המוסיפה תחום חדש
export async function postDomain(domainName) {
    const [{ insertId }] = await pool.query(`
        INSERT INTO domains(domainName) 
        VALUES (?)
    `, [domainName]);
    return await getDomain(insertId);
}

// פונקציה לעדכון תחום
export async function updateDomain(domainCode, domainData) {
    const { domainName } = domainData;
    const query = `
        UPDATE domains 
        SET domainName = ? 
        WHERE idDomain = ?
    `;
    await pool.query(query, [domainName, domainCode]);
}

// פונקציה המחזירה את שמות התחומים בלבד
export async function getDomainNames() {
    const [domainNames] = await pool.query(`
        SELECT domainName 
        FROM domains
    `);
    return domainNames;
}