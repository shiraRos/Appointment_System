import pool from './database.js'

//פונקציה המחזירה את כל לקוחות
export async function getSchedules() {
  const [schedules] = await pool.query(`
        SELECT scheduleCode, professionalServiceCode, dayOfWeek, startTime, endTime FROM schedules
    `);
  return schedules;
}

//פונקציה המחזירה לקוח לפי מספר זהות
export async function getSchedule(id) {
  const [[schedule]] = await pool.query(`scheduleCode, professionalServiceCode, dayOfWeek, startTime, endTime FROM schedules where scheduleCode=?`, [id]);
  return schedule;
}

// פונקציה למחיקת משימה לפי מספר זיהוי
export async function deleteSchedule(scheduleCode) {
  await pool.query(`DELETE FROM schedules WHERE scheduleCode = ?`, [scheduleCode]);
}

//פונקציה לעדכון פרטי לקוח
export const updateSchedule = async (scheduleCode, scheduleData) => {
  const { professionalServiceCode, dayOfWeek, startTime, endTime } = scheduleData;
  const query = 'UPDATE schedules SET scheduleCode = ?, professionalServiceCode = ?, dayOfWeek = ?,startTime = ?, endTime=? WHERE scheduleCode = ?';
  await pool.query(query, [scheduleCode, professionalServiceCode, dayOfWeek, startTime, endTime]);
};

export async function postSchedule(professionalId, dayOfWeek, startTime, endTime, service) {
  try {
    const [result] = await pool.query(
      `INSERT INTO schedules (professionalId, dayOfWeek, startTime, endTime, prof_serviceId) 
           VALUES (?, ?, ?, ?, ?)`,
      [professionalId, dayOfWeek, startTime, endTime, service]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(`Error inserting schedule: ${error.message}`);
  }
}

export async function getDaysOff(userId) {
  try {
    // שאילתת SQL כדי לשלוף את ימי השבוע שבהם המקצוען אינו עובד
    const [rows] = await pool.query(`
          SELECT dayOfWeek 
          FROM schedules 
          WHERE professionalId = ?
      `, [userId]);
    // ממפה את השורות כדי לחלץ רק את ערכי dayOfWeek לתוך מערך
    const daysOff = rows.map(row => row.dayOfWeek);
    // מחזיר את המערך daysOff
    return daysOff;
  } catch (error) {
    // טיפול בשגיאות שקורות במהלך השאילתה למסד הנתונים
    console.error('Error fetching schedule:', error);
    throw new Error('Internal server error');
  }
}

// פונקציה להחזרת schedules לפי professionalId ולפי serviceTypeCode
export async function getSchedulesByProfessionalIdAndServiceType(professionalId, serviceTypeCode) {
  try {
    const [rows] = await pool.query(
      `SELECT startTime, endTime 
       FROM schedules 
       WHERE professionalId = ? AND service_typeCode = ?`,
      [professionalId, serviceTypeCode]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching schedules by professionalId and serviceTypeCode:', error);
    throw new Error('Internal server error');
  }
}
