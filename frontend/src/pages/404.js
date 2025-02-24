import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Custom404() {
    const router = useRouter();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f5f5f5', // Light gray background
                textAlign: 'center',
                px: 2,
            }}
        >
            <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '4rem', md: '6rem' } }}>
                404
            </Typography>
            <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/')}
                sx={{ textTransform: 'none', px: 4, py: 1.5, fontSize: '1rem' }}
            >
                Go Back to Home
            </Button>
        </Box>
    );
}
