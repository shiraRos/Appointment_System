import express from 'express';
import { getComments, getAverageRating, getComment, postComment, deleteComment, updateComment, getCommentsByCustomerAndProfessional, getCommentsByProfessional } from '../database/commentsdb.js';

const route = express.Router();


//פונקציה המחזירה את כל הדירוג הממוצע
route.get('/rating/:idProfessional', async (req, res) => {
    try {
        const { idProfessional } = req.params;
        const averageRating = await getAverageRating(idProfessional);
        res.json({ averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


route.get('/', async (req, res) => {
    try {
        const { IdCustomer, IdProfessional } = req.query;
        if (IdCustomer && IdProfessional) {
            const comments = await getCommentsByCustomerAndProfessional(IdCustomer, IdProfessional);
            res.json(comments);
        } else if (IdProfessional) {
            //פונקציה המחזירה את כל ההמלצות לפי בעל העסק
            const comments = await getCommentsByProfessional(IdProfessional);
            res.json(comments);
        } else {
            const comments = await getComments();
            res.json(comments);
        }
    } catch (error) {
        console.error(error);  // הוספת לוג לשגיאה
        res.status(500).json({ message: error.message });
    }
});



route.get('/:comment', async (req, res) => {
    try {
        const { comment } = req.params;
        const commentData = await getComment(comment);
        if (!commentData) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json(commentData);
    } catch (error) {
        console.error(error);  // הוספת לוג לשגיאה
        res.status(500).json({ message: error.message });
    }
});
//הוספת הערה
route.post('/', async (req, res) => {
    try {
        const { queueCode, IdProfessional, IdCustomer, rating, content, comments_date } = req.body;
        const comment = await postComment(queueCode, IdProfessional, IdCustomer, rating, content, comments_date);
        res.json({ comment, message: 'Comment added successfully' });
    } catch (error) {
        console.error(error);  // הוספת לוג לשגיאה
        res.status(500).json({ message: error.message });
    }
});

route.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateComment(id, req.body);
        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error(error);  // הוספת לוג לשגיאה
        res.status(400).json({ message: error.message });
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await deleteComment(id);
        res.json({ comment, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);  // הוספת לוג לשגיאה
        res.status(500).json({ message: error.message });
    }
});

export default route;