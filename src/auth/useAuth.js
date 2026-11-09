import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
    const [session, setSession] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [sessionError, setSessionError] = useState(null);

    useEffect(() => {
    let active = true;

    async function checkSession() {
        try {
        if (!supabase) {
            throw new Error('Supabase is not configured.');
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (active) {
            setSession(data.session);
        }
        } catch (error) {
        if (active) {
            setSessionError(error.message);
        }
        } finally {
        if (active) {
            setCheckingSession(false);
        }
        }
    }

    checkSession();

    return () => {
        active = false;
    };
    }, []);

    return { session, checkingSession, sessionError };
}