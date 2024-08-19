
import pool from './database.js';

// Function to get all professional services
export async function getProfessionalServices() {
    const [professionalServices] = await pool.query(`
        SELECT * FROM professional_services
    `);
    return professionalServices;
}

// Function to get a professional service by ID
export async function getProfessionalServicesById(id) {
    const [profService] = await pool.query(`
        SELECT serviceTypeCode, idProfessional, price, duration 
        FROM professional_services 
        WHERE idProfessional = ?
    `, [id]);
    return profService;
}

// Function to update an existing professional service
export const updateProfessionalService = async (profServiceID, profServiceData) => {
    const { serviceTypeCode, idProfessional, price, duration } = profServiceData;
    const query = `
        UPDATE professional_services 
        SET serviceTypeCode = ?, idProfessional = ?, price = ?, duration = ? 
        WHERE ProffServiceID = ?
    `;
    await pool.query(query, [serviceTypeCode, idProfessional, price, duration, profServiceID]);
};


export async function getProffServiceID(idProfessional, serviceTypeCode) {
    const query = `
        SELECT ProffServiceID
        FROM professional_services
        WHERE idProfessional = ?
        AND ServiceTypeCode = ?
    `;
    const [[result]] = await pool.query(query, [idProfessional, serviceTypeCode]);
    return result ? result.ProffServiceID : null;
}

export async function postProfessionalService(idProfessional, typeName, Price, Duration) {
    try {

        const [result] = await pool.query(
            `INSERT INTO professional_services (idProfessional, ServiceTypeCode, Price, Duration) 
         VALUES (?, ?, ?, ?)`,
            [idProfessional, typeName, Price, Duration]
        );
        return result.insertId;
    } catch (error) {
        throw new Error(`Error inserting professional service: ${error.message}`);
    }
}