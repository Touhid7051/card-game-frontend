import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, bet, openedCards, cards } = location.state || {};

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>Game Result</Typography>
        <Typography align="center" gutterBottom>
          {result === 'lose' ? 'You lost! Better luck next time.' : `You won! Result: ${JSON.stringify(result)}`}
        </Typography>
        <Typography align="center" gutterBottom>
          Bet Amount: {bet}
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/')}>Play Again</Button>
      </Paper>
    </Box>
  );
};

export default ResultsPage;
