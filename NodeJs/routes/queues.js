
import express from 'express';
import { postMessage } from '../database/messagesdb.js'; 

import {
  getQueues,
  getQueuesByDateAndBusinessOwner,
  cancelQueueByCode,
  getFilteredQueues,
  getQueueById,
  getQueuesByCustomer,
  postQueue,
  updateExistQueue,
  updateQueue,
  updateEndedAppointments,
  getQueuesByFullDateAndBusinessOwner,
  isNextMonthAvailable,
  updateQueueStatus,
  openNextMonthSchedule
} from '../database/queuesdb.js';


const router = express.Router();

// Cancel all appointments for a given day
router.put('/cancel/:date/:userId', async (req, res) => {
  const { date, userId } = req.params;
  try {

    // שליפת כל התורים של בעל העסק לתאריך ספציפי
    const appointments = await getQueuesByFullDateAndBusinessOwner(date, userId);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for the given date.' });
    }
    for (const appointment of appointments) {
      // עדכון מצב התור לבוטל
      await updateQueueStatus(appointment.QueueCode, 'cancelled');
      // יצירת הודעה חדשה עבור הלקוח באתר
      const content = `Your appointment on ${appointment.Date} at ${appointment.Hour} has been canceled.`;
      const title = 'Appointment Cancellation';
      const queueCode = appointment.QueueCode;
      const isRead = false;
      await postMessage(queueCode, isRead, content, title);
    }

    res.status(200).json({ message: 'All appointments for the day have been canceled and notifications sent.' });
  } catch (error) {
    console.error('Error canceling appointments:', error);
    res.status(500).json({ message: 'Error canceling appointments.' });
  }
});

//פונקציה המקבלת פרטי תור עי מספר זהות של בעל מקצוע וסוג השרות
router.get('/details', async (req, res) => {
  try {
    const { idProfessional, serviceTypeCode } = req.query;
    const details = await getFilteredQueues(idProfessional, serviceTypeCode);
    if (!details) {
      return res.status(404).json({ message: 'Details not found.' });
    }
    res.json(details);
  } catch (error) {
    console.error('Error fetching queue data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get queues by full date and business owner
router.get('/date/:formattedDate/:userid', async (req, res) => {
  const { formattedDate, userid } = req.params;
  try {
    const queues = await getQueuesByFullDateAndBusinessOwner(formattedDate, userid);
    res.json(queues);
  } catch (error) {
    console.error('Error fetching queues by date:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all queues for a specific month and year for a business owner
router.get('/allQueue/:month/:year/:userid', async (req, res) => {
  const { month, year, userid } = req.params;
  try {
    const queues = await getQueuesByDateAndBusinessOwner(month, year, userid);
    res.json(queues);
  } catch (error) {
    console.error('Error fetching queues by date:', error);
    res.status(500).json({ message: error.message });
  }
});

//פונקציה שמחזירה את כל התורים לפי מספר זהות משתמש
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const queues = await getQueuesByCustomer(customerId);
    res.json(queues);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check if next month is available for booking for a business owner
router.get('/isAvailable/nextMonth/:businessOwnerId', async (req, res) => {
  try {
    const { businessOwnerId } = req.params;
    const isAvailable = await isNextMonthAvailable(businessOwnerId);
    res.json({ isNextMonthAvailable: isAvailable });
  } catch (error) {
    console.error('Error checking next month availability:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update ended appointments
router.put('/updateEndedAppointments', async (req, res) => {
  try {
    await updateEndedAppointments();
    res.json({ message: 'Ended appointments updated successfully' });
  } catch (error) {
    console.error('Error updating ended appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

//ביטול תור קיים עיי קבלת קוד התור העתיד להתבטל
router.put('/cancel/:queueCode', async (req, res) => {
  try {
    const { queueCode } = req.params;
    const result = await cancelQueueByCode(queueCode);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    res.status(200).json({ message: 'Queue cancelled successfully' });
  } catch (error) {
    console.error('Error in route handler for cancelling queue:', error);
    res.status(500).json({ message: error.message });
  }
});

 //פונקציה המעדכנת את כל פרטי בעל העסק עי שם וסוג שרות
router.put('/update/:QueueCode', async (req, res) => {
  try {
    const { QueueCode } = req.params;
    const { customerId, Status } = req.body;
    await updateExistQueue(QueueCode, customerId, Status);
    res.json({ message: 'Queue updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a new queue
router.post('/', async (req, res) => {
  try {
    const { professionalServiceCode, customerCode, date, hour, status } = req.body;
    const Queue = await postQueue(professionalServiceCode, customerCode, date, hour, status);
    res.json({ Queue, message: 'Queue added successfully' });
  } catch (error) {
    res.status(201).json({ message: error.message });
  }
});

// Delete a queue by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const Queue = await deleteQueue(id);
    res.json({ Queue, message: 'Queue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/openNextMonthSchedule/:businessOwnerId', async (req, res) => {
  try {
    const { businessOwnerId } = req.params;
    await openNextMonthSchedule(businessOwnerId);
    res.json({ message: 'Next month schedule opened successfully' });
  } catch (error) {
    console.error('Error opening next month schedule:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;