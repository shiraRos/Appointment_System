
import express from 'express'
import { getCities, getCityById, postCity, updateCity } from '../database/citiesdb.js'

const route = express.Router();

//החזרת כל הערים מבסיס הנתונים
route.get('/', async (req, res) => {
    try {
        const cities = await getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});

//החזרת בעל מקצוע לפי מספר מזהה
route.get('/:cityId', async (req, res) => {
    try {
        const { cityId } = req.params;
        const city = await getCityById(cityId);
        if (!city) {
            return res.status(404).json({ message: 'city not found.' });
        }
        res.json(city);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});

//הכנסת בעל מקצוע 
route.post('/', async (req, res) => {
    try {
        const { CityName } = req.body;
        const city = await postCity(CityName);
        res.json({ city, message: 'city added successfully' });
    }
    catch (error) {
        res.status(201).json({ messege: error.messege })
    }
});

//עדכון פרטי בעל מקצוע
route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateCity(id, req.body);
        res.json({ message: 'City updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// מחיקת בעל מקצוע לפי מספר זיהוי
route.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const city = await deleteCity(id);
        res.json({ city, message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default route;