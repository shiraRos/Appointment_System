import express from 'express'
import { getCustomers, getCustomer, getCustomerByEmailAndPassword, postCustomer, updateCustomer } from '../database/customersdb.js'

const route = express.Router();
//החזרת הערות מבסיס הנתונים
route.get('/', async (req, res) => {
    try {
        const customers = await getCustomers();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});

// הוספת לקוח קיים
route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getCustomerByEmailAndPassword(email, password);

        if (user) {
            const userContextData = {
                idCustomer: user.idCustomer,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                cityCode: user.cityCode,
                cityName: user.CityName,
                address: user.address,
                phone: user.phone
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

//החזרת הערה לפי מספר זהות
route.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await getCustomer(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'customer not found.' });
        }
        res.json(customer);
    }
    catch (error) {
        res.status(500).json({ messege: error.messege })
    }
});

//הוספת לקוח חדש  
route.post('/', async (req, res) => {
    try {
        const { idCustomer, firstName, lastName, address, cityCode, email, phone, passwordCust } = req.body;
        const customer = await postCustomer(idCustomer, firstName, lastName, address, cityCode, email, phone, passwordCust);
        res.json({ customer, message: 'customer added successfully' });
    }
    catch (error) {
        res.status(201).json({ messege: error.messege })
    }
});

//עדכון פרטי 
route.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await updateCustomer(userId, req.body);
        res.json(updatedUser); 
    } catch (error) {
        res.status(400).json({...updateCustomer, message: error.message });
    }
});


export default route;