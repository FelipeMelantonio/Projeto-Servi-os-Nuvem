import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';

function PageLayout({ title, subtitle, children, maxWidth = "sm" }) {
  return (
    <Container component="main" maxWidth={maxWidth} sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 3
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Paper>
    </Container>
  );
}

export default PageLayout;
