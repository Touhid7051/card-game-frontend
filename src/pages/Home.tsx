import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getBalance, startGame } from '../api/legendHunt'
import { Button, Typography, Box, Select, MenuItem } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance
  })
  const navigate = useNavigate()
  const [bet, setBet] = useState(5.00)

  const { mutate, isPending } = useMutation({
    mutationFn: () => startGame(bet),
    onSuccess: (res) => {
      navigate(`/game/${res.data.id}`)
    },
  })

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{
      background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%), radial-gradient(circle at 20% 30%, rgba(0,255,255,0.08) 0%, transparent 80%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.10) 0%, transparent 80%)',
      backgroundBlendMode: 'screen, normal',
      backgroundAttachment: 'fixed',
    }}>
      <Box sx={{
        bgcolor: 'rgba(30,34,90,0.97)',
        border: '2px solid #00ffc3',
        boxShadow: '0 0 40px 10px #00ffc3, 0 0 80px 20px #6c63ff33',
        borderRadius: 6,
        p: 5,
        minWidth: 340,
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h3" align="center" gutterBottom sx={{
          color: '#00ffc3',
          textShadow: '0 0 18px #00ffc3',
          fontFamily: 'Orbitron, Arial, sans-serif',
          mb: 2,
        }}>
          Legend Hunt
        </Typography>
        <Typography align="center" sx={{
          color: '#ffd700',
          fontFamily: 'Orbitron, Arial, sans-serif',
          fontWeight: 'bold',
          textShadow: '0 0 3px #b8860b, 0 1px 4px #0006',
          mb: 2,
        }}>
          USDT Balance: {isLoading ? 'Loading...' : `${data?.balance} USDT`}
        </Typography>
        <Box my={2} width="100%">
          <Typography sx={{
            color: '#00ffc3',
            fontFamily: 'Orbitron, Arial, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            mb: 1,
            textAlign: 'center',
            letterSpacing: 0.5,
            textShadow: '0 0 8px #00ffc3',
          }}>
            Select the preferred prize pools to win more prizes
          </Typography>
          <Select value={bet} onChange={e => setBet(Number(e.target.value))} fullWidth sx={{
            bgcolor: '#222',
            color: '#00ffc3',
            border: '1.5px solid #00ffc3',
            borderRadius: 2,
            fontFamily: 'Orbitron, Arial, sans-serif',
            fontWeight: 700,
            boxShadow: '0 2px 12px #00ffc355',
            '& .MuiSvgIcon-root': { color: '#00ffc3' },
          }}>
            <MenuItem value={5}>5.00 (Legend)</MenuItem>
            <MenuItem value={7.5}>7.50 (Legend + Real Estate)</MenuItem>
            <MenuItem value={10}>10.00 (All Pools)</MenuItem>
          </Select>
        </Box>
        <Button
          variant="contained"
          disabled={isPending}
          onClick={() => mutate()}
          sx={{
            background: 'linear-gradient(90deg, #00ffc3 0%, #6c63ff 100%)',
            color: '#222',
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontSize: '1.2rem',
            fontFamily: 'Orbitron, Arial, sans-serif',
            boxShadow: '0 2px 12px #00ffc355',
            mt: 2,
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
            '&:hover': {
              background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
              color: '#fff',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 24px rgba(67,206,162,0.18)',
            },
          }}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  )
}
