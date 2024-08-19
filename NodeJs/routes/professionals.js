
import express from 'express';
import { getAllProfessionals, postProfessional, getProfessionalByEmailAndPassword, getAllBuisnessNames, getProfessionalsByDomainAndType, getProfessionalByName, getProfessionalDetails, updateProfessional } from '../database/professionalsdb.js';
import { postProfessionalService } from '../database/professional_servicesdb.js';
import { postSchedule } from '../database/scheduledb.js';
const route = express.Router();


route.post('/registerBusiness', async (req, res) => {
    try {
        const {
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
            phone,
            services,
            workingHours,
        } = req.body;

        // Insert new professional into professionals table
        const result = await postProfessional(
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
        );

        console.log(1111 , result);
        // Insert services into professional_services table
        for (const service of services) {
            await postProfessionalService(result.professionalId, service.serviceType, service.price, service.duration);
        }

        // Insert working hours into schedules table
        for (const dayOfWeek in workingHours) {
            const daySchedules = workingHours[dayOfWeek];
            daySchedules.forEach(async (slot) => {
                if (slot.isWorking) {
                    await postSchedule(result.professionalId, dayOfWeek, slot.start, slot.end, slot.service);
                }
            });
        }
        console.log(2222 , result);

        console.log('Registration successful');
        res.json({ ...result, message: 'Business registered successfully' });
    } catch (error) {
        console.error('Error registering business:', error);
        res.status(500).json({ message: error.message });
    }
});

route.get('/', async (req, res) => {
    try {
        const professionals = await getAllProfessionals();
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//הוספת מנהל קיים
route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getProfessionalByEmailAndPassword(email, password);

        if (user) {
            const userContextData = {
                idProfessional: user.idProfessional,
                firstName: user.firstName,
                lastName: user.lastName,
                domainCode: user.domainCode,
                domainName: user.domainName,
                startDate: user.startDate,
                email: user.email,
                cityCode: user.cityCode,
                cityName: user.CityName,
                address: user.address,
                phone: user.phone,
                business_name: user.business_name
            };
            res.status(200).json(userContextData);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).send('Error querying the database');
        console.error('Error in login route:', error);
    }
});


//קבלת כל שמות בעלי העסק הקיימים
route.get('/business_name', async (req, res) => {
    try {
        const business_names = await getAllBuisnessNames();
        res.json(business_names);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//קבלת כל בעלי המקצוע שיש להם את התחום המבוקש
route.get('/type_service', async (req, res) => {
    try {
        const { field, type } = req.query;
        const professionals = await getProfessionalsByDomainAndType(field, type);
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 //פונקציה המקבלת את כל פרטי בעל העסק עישם וסוג שרות
route.get('/details', async (req, res) => {
    try {
        const { businessName, serviceType } = req.query;
        const details = await getProfessionalDetails(businessName, serviceType);
        if (!details) {
            return res.status(404).json({ message: 'Details not found.' });
        }
        res.json(details);
    } catch (error) {
        console.error("Details not found")
        res.status(500).json({ message: error.message });
    }
});

//החזרת כל פרטי בעל עסק לפי שם העסק
route.get('/:business_name', async (req, res) => {
    try {
        const { business_name } = req.params;
        const professional = await getProfessionalByName(business_name);
        if (!professional) {
            return res.status(404).json({ message: 'Professional not found.' });
        }
        res.json(professional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update professional details
route.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await updateProfessional(userId, req.body);
        res.json({ ...updatedUser, message: 'Professional updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default route;