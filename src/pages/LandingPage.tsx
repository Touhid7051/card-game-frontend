import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import { useState } from 'react';

const LandingPage = () => {
  const [bet, setBet] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (bet && Number(bet) > 0) {
      navigate('/game', { state: { bet: Number(bet) } });
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h3" align="center" gutterBottom>Legend Hunt</Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Welcome to Legend Hunt! Enter your bet amount to start the game.
        </Typography>
        <TextField
          label="Bet Amount"
          type="number"
          value={bet}
          onChange={e => setBet(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleStart} disabled={!bet || Number(bet) <= 0}>
          Start Game
        </Button>
      </Paper>
    </Box>
  );
};

export default LandingPage;
