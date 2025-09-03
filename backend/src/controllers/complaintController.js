import { supabase } from '../config/supabaseClient.js';

// Get all complaint records
export const getAllComplaints = async (req, res) => {
    const { data, error } = await supabase
        .from('complaints')
        .select('*');

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
};

// Submit a new complaint
export const submitComplaint = async (req, res) => {
    const { postcode, urgency } = req.body;
    const user_id = req.user.id;

    if (typeof postcode !== 'number' || typeof urgency !== 'number') {
        return res.status(400).json({ error: 'postcode and urgency are required and must be numbers.' });
    }

    const { data, error } = await supabase
        .from('complaints')
        .insert([{ postcode, urgency, user_id }])
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(201).json(data);
    }
};