"use client"

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Toggle } from '@radix-ui/react-toggle';
import { MdDarkMode } from 'react-icons/md';

export const ThemeChanger = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (

        <Toggle onClick={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }}>
            < MdDarkMode className='text-slate-900 dark:text-white mr-4' />
        </Toggle>

    );
};
