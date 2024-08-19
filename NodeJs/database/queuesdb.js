import pool from './database.js';
import { getProfessionalServicesById } from './professional_servicesdb.js';
import { getDaysOff, getSchedulesByProfessionalIdAndServiceType } from './scheduledb.js';
import { getProfessionalServiceCode } from './professionalsdb.js';

// פונקציה המחזירה את כל התורים
export async function getQueues() {
    const [queues] = await pool.query(`
        SELECT * FROM queues
    `);
    return queues;
}


//קבלת כל התורים עי  מספר זהות בעל מקצוע וסוג טיפול ואם התור זמין
export async function getFilteredQueues(idProfessional, serviceTypeCode) {
    const query = `
        SELECT q.QueueCode, q.Date, q.Hour
        FROM queues q
        INNER JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
        WHERE ps.idProfessional = ? AND ps.ServiceTypeCode = ? AND q.Status = 'available'
    `;
    try {
        const [details] = await pool.query(query, [idProfessional, serviceTypeCode]);
        return details;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error; 
    }
}


// פונקציה המחזירה תור לפי מספר מזהה
export async function getQueueById(id) {
    const [[queue]] = await pool.query(`select * from queues where queueCode=?`, [id]);
    return queue;
}


//פונקציה שמחזירה את כל התורים לפי מספר זהות משתמש
export async function getQueuesByCustomer(customerId) {
    try {
        const query = `
            SELECT q.QueueCode, q.ProfessionalServiceCode, q.CustomerCode, q.Date, q.Hour, q.Status, 
                   c.idCustomer, c.firstName, c.lastName, c.address AS customerAddress, c.cityCode AS customerCityCode, c.email AS customerEmail, c.phone AS customerPhone,
                   p.business_name, p.address AS businessAddress
            FROM queues q
            JOIN customers c ON q.CustomerCode = c.idCustomer
            JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
            JOIN professionals p ON ps.idProfessional = p.idProfessional
            WHERE q.CustomerCode = ? AND q.Status != 'cancelled'
        `;
        const [queues] = await pool.query(query, [customerId]);
        return queues;
    } catch (error) {
        console.error('Error fetching queues by customer ID:', error);
        throw error;
    }
}


// פונקציה המחזירה את כל התורים של בעל מקצוע ספציפי
export async function getQueuesByProfessionalId(idProfessional) {
    const query = `
        SELECT q.QueueCode, q.Date, q.Hour, q.Status,
               c.idCustomer, c.firstName, c.lastName, c.phone,
               ps.ServiceTypeCode, st.typeName AS serviceTypeName
        FROM queues q
        JOIN customers c ON q.CustomerCode = c.idCustomer
        JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
        JOIN type_service st ON ps.ServiceTypeCode = st.typeCode
        WHERE ps.idProfessional = ?
        ORDER BY q.Date, q.Hour
    `;

    try {
        const [queues] = await pool.query(query, [idProfessional]);
        return queues;
    } catch (error) {
        console.error('Error fetching queues by professional ID:', error);
        throw error;
    }
}

// פונקציה לבדוק האם לוח התורים לחודש הבא כבר פתוח לבעל עסק ספציפי
export async function isNextMonthAvailable(businessOwnerId) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth() + 1; 
    const query = `
    SELECT COUNT(*) AS count
    FROM queues q
    JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
    WHERE YEAR(q.Date) = ? AND MONTH(q.Date) = ? AND ps.idProfessional = ?
    `;

    try {
        // מבצע את השאילתא לבדיקת כמות התורים לחודש הבא עבור בעל עסק מסוים
        const [result] = await pool.query(query, [year, month, businessOwnerId]);
        const { count } = result[0];
        // אם יש לפחות תור אחד, הלוח פתוח
        return count <= 0;
    } catch (error) {
        console.error('Error checking next month availability:', error);
        throw error;
    }
}


 //פונקציה המעדכנת את כל פרטי בעל העסק עי שם וסוג שרות

export async function updateExistQueue(QueueCode, customerId, StatusQueue) {
    try {
        const query = 'UPDATE queues SET CustomerCode=?, Status=?  WHERE QueueCode = ?';
        await pool.query(query, [customerId, StatusQueue, QueueCode]);
        return { message: 'Queue updated successfully' };
    } catch (error) {
        throw new Error(`Could not update queue: ${error.message}`);
    }
}

// פונקציה לעדכון פרטי לקוח
export const updateQueue = async (queueID, queueData) => {
    const { professionalServiceCode, customerCode, date, hour, status } = queueData;
    const query = 'UPDATE queues SET professionalServiceCode = ?, customerCode = ?, date = ?,hour = ?, status=?  WHERE queueCode = ?';
    await pool.query(query, [professionalServiceCode, customerCode, date, hour, status, queueID]);
};

// פונקציה לעדכון מצב תור
export async function updateQueueStatus(queueCode, status) {
    const query = 'UPDATE queues SET Status = ? WHERE QueueCode = ?';
    await pool.query(query, [status, queueCode]);
}
//ביטול תור קיים עיי קבלת קוד התור העתיד להתבטל
export async function cancelQueueByCode(queueCode) {
    try {
        const query = `
            UPDATE queues
            SET Status = 'available'
            WHERE QueueCode = ?
        `;
        const [result] = await pool.query(query, [queueCode]);
        return result;
    } catch (error) {
        console.error('Error cancelling queue by code:', error);
        throw error;
    }
}

// פונקציה המוסיפה תור חדשה
export async function postQueue(professionalServiceCode, customerCode, date, hour, status) {
    const [{ insertId }] = await pool.query(`insert into queues( professionalServiceCode, customerCode, date,hour ,status) VALUES (?,?,?,?,?)`, [professionalServiceCode, customerCode, date, hour, status]);
    return insertId;
}

// פונקציה למחיקת תור לפי מספר זיהוי
export async function deleteQueue(id) {
    await pool.query(`DELETE FROM queues WHERE QueueCode = ?`, [id]);
}

//החזרת התורים של בעל העסק לפי ת.ז ולפי תאריך ולפי תורים תפוסים
export async function getQueuesByDateAndBusinessOwner(month, year, id) {
    const query = `
      SELECT q.QueueCode, q.Date, q.Hour, q.Status, c.firstName AS customerFirstName, c.lastName AS customerLastName, c.phone AS customerPhone,
             st.typeName AS serviceTypeName
      FROM queues q
      JOIN customers c ON q.CustomerCode = c.idCustomer
      JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
      JOIN type_service st ON ps.ServiceTypeCode = st.typeCode
      JOIN professionals bo ON ps.idProfessional = bo.idProfessional
      WHERE MONTH(q.Date) = ? AND YEAR(q.Date) = ? AND bo.idProfessional = ? AND q.Status IN ('waiting', 'finished', 'available')
    `;

    try {
        const [queues] = await pool.query(query, [month, year, id]);
        const localQueues = queues.map(queue => {
            const localDate = new Date(queue.Date);
            queue.Date = formatDate(localDate); // format to YYYY-MM-DD
            return queue;
        });
        return localQueues;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}


//החזרת כל התורים של בעל העסק לפי ת.ז ולפי חודש
export async function getAllQueuesByMonthAndBusinessOwner(date, businessOwnerName) {
    const query = `
        SELECT q.QueueCode, q.Date, q.Hour, q.Status, c.firstName AS customerFirstName, c.lastName AS customerLastName, c.phone AS customerPhone,
               st.typeName AS serviceTypeName
        FROM queues q
        JOIN customers c ON q.CustomerCode = c.idCustomer
        JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
        JOIN type_service st ON ps.ServiceTypeCode = st.typeCode
        JOIN professionals bo ON ps.idProfessional = bo.idProfessional
        WHERE MONTH(q.Date) = MONTH(?) AND YEAR(q.Date) = YEAR(?) 
          AND bo.firstName = ? 
          AND q.Status IN ('finished', 'available', 'waiting')
    `;

    try {
        const [queues] = await pool.query(query, [date, date, businessOwnerName]);
        const localQueues = queues.map(queue => {
            const localDate = new Date(queue.Date);
            queue.Date = formatDate(localDate); // format to YYYY-MM-DD
            return queue;
        });
        return localQueues;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}


const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function getQueuesByFullDateAndBusinessOwner(fullDate, id) {
    const query = `
      SELECT q.QueueCode, q.Date, q.Hour, q.Status, c.firstName AS customerFirstName, c.lastName AS customerLastName, c.phone AS customerPhone,
             st.typeName AS serviceTypeName
      FROM queues q
      JOIN customers c ON q.CustomerCode = c.idCustomer
      JOIN professional_services ps ON q.ProfessionalServiceCode = ps.ProffServiceID
      JOIN type_service st ON ps.ServiceTypeCode = st.typeCode
      JOIN professionals bo ON ps.idProfessional = bo.idProfessional
      WHERE DATE(q.Date) = ? AND bo.idProfessional = ? AND q.Status IN ('waiting', 'finished', 'available')
    `;

    try {
        const [queues] = await pool.query(query, [fullDate, id]);
        const localQueues = queues.map(queue => {
            const localDate = new Date(queue.Date);
            queue.Date = formatDate(localDate); // format to YYYY-MM-DD
            return queue;
        });
        return localQueues;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}


export const updateEndedAppointments = async () => {
    try {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query = `
        UPDATE queues
        SET Status = 'Finish'
        WHERE Date = ? AND CONCAT(Date, ' ', Hour) <= ?
      `;
        await pool.query(query, [formattedDate, now]);
    } catch (error) {
        console.error('שגיאה בעדכון התורים שסיימו:', error);
        throw error;
    }
};


// פונקציה לפתיחת לוח תורים לחודש הבא לפי תעודת הזהות של בעל העסק
export async function openNextMonthSchedule(professionalId) {
    // יצירת אובייקט תאריך לחודש הבא
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth() + 1; // JavaScript מתחיל את החודשים מ-0 לכן נוסיף 1
    try {
        // בדיקה אם הלוח כבר פתוח לחודש הבא
        const IsNotAvailable = await isNextMonthAvailable(professionalId);
        if (IsNotAvailable) {
            // שאילתא לקבלת כל השירותים של בעל העסק
            const services = await getProfessionalServicesById(professionalId);
            // פתיחת לוח התורים לכל יום בחודש הבא
            for (let day = 1; day <= getDaysInMonth(year, month); day++) {
                // בדיקה אם יום זה יום עבודה לבעל העסק
                const workingDays = await getDaysOff(professionalId);
                if (!workingDays.includes(day)) {
                    // לולאה עבור כל שירות כדי לפתוח תורים
                    for (const service of services) {
                        const { serviceTypeCode, duration } = service;
                        // קבלת זמני התחלה וסיום מתוך schedules לפי professionalId ולפי serviceTypeCode
                        const schedules = await getSchedulesByProfessionalIdAndServiceType(professionalId, serviceTypeCode);
                        // לולאה על כל ה-schedules שמתקבלים
                        for (const schedule of schedules) {
                            const { startTime, endTime } = schedule;
                            // פתיחת תורים ליום זה עבור שירות זה
                            const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            await openDailySchedule(professionalId, date, serviceTypeCode, startTime, endTime, duration);
                        }
                    }
                }
            }
        } else {
            return { message: "The scheduale for next month already exists" };
        }

        return { message: "Schedueld for next month opened successfuly" };
    } catch (error) {
        console.error('Error in opening Schedueld for next month', error);
        throw error;
    }
}

// פונקציה לקבלת מספר הימים בחודש
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}


// פונקציה להמרת זמן בפורמט HH:mm:ss לשניות
function timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:00`;
}


function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}


// פונקציה לפתיחת לוח תורים ליום ספציפי
async function openDailySchedule(professionalId, date, serviceTypeCode, startTime, endTime, duration) {
    try {
        // שליפת ProfessionalServiceCode לפי serviceTypeCode ו-professionalId
        const ProfessionalServiceCode = await getProfessionalServiceCode(professionalId, serviceTypeCode);
        if (!ProfessionalServiceCode) {
            throw new Error(`לא נמצא ProfessionalServiceCode עבור serviceTypeCode ${serviceTypeCode} ו-professionalId ${professionalId}`);
        }

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const durationMinutes = timeToMinutes(duration);

        for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += durationMinutes) {
            const currentHour = minutesToTime(currentMinutes);
            // יצירת תור חדש
            await postQueue(ProfessionalServiceCode, null, date, currentHour, 'available');
        }

        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        return { message: `לוח תורים נפתח בהצלחה ליום ${formattedDate}` };
    } catch (error) {
        console.error(`שגיאה בפתיחת לוח תורים יומי עבור תאריך ${date}:`, error);
        throw error;
    }
}
