import express from 'express'
import { getSchedules, getDaysOff, getSchedule, postSchedule, deleteSchedule, updateSchedule } from '../database/scheduledb.js'

const route = express.Router();
route.get('/', async (req, res) => {
    try {
        const schedules = await getSchedules();
        res.json(schedules);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});
route.get('/daysOfWeek/:userId', async (req, res) => {
    const { userId } = req.params; 
    try {
        // קריאה לפונקציה getDaysOff כדי לקבל את ימי החופש
        const daysOff = await getDaysOff(userId);
        res.json({ daysOff });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
route.get('/:schedule', async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const schedule = await getSchedule(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'schedule not found.' });
        }
        res.json(schedule);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});

route.post('/', async (req, res) => {
    try {
        const { professionalServiceCode, dayOfWeek, startTime, endTime } = req.body;
        const schedule = await postSchedule(professionalServiceCode, dayOfWeek, startTime, endTime);
        res.json({ schedule, message: 'schedule added successfully' });
    }
    catch (error) {
        res.status(201).json({ messege: error.messege })
    }
});

route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateSchedule(id, req.body);
        res.json({ message: 'schedule updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await deleteSchedule(id);
        res.json({ schedule, message: 'schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





export default route;