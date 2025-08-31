// src/controllers/authController.js
import { supabase } from '../config/supabaseclient.js';

export const signUp = async (req, res) => {
    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
    }
    if (role !== 'feedback_user' && role !== 'management_user') {
        return res.status(400).json({ error: "Role must be 'feedback_user' or 'management_user'." });
    }

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }
    
    if (!authData.user) {
        return res.status(500).json({ error: 'User registration failed, please try again.' });
    }

    // Insert the role into our custom `profiles` table
    const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        role: role,
    });

    if (profileError) {
        // This is a tricky state. The user is created in auth but not in profiles.
        // For a hackathon, logging this is sufficient. In production, you'd handle this more gracefully.
        console.error("Failed to create user profile:", profileError);
        return res.status(500).json({ error: 'User registered but failed to set profile role.' });
    }

    res.status(201).json({ user: authData.user });
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    res.status(200).json(data);
};