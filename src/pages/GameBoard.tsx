import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { flipCard } from '../api/legendHunt'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import { useState } from 'react'
import './GameBoard.css';

function getCardSymbol(card: string | null) {
  // Symbol for each card type

  switch ((card || '').toLowerCase()) {
    case 'legend': return '🦁';
    case 'real estate': return '🏠';
    case 'land': return '🌄';
    case 'joker': return '🃏';
    case 'blank': return '❌';
    default: return '❓';
  }
}

function getCardCssClass(card: string | null) {
  switch ((card || '').toLowerCase()) {
    case 'legend': return 'legend';
    case 'real estate': return 'real-estate';
    case 'land': return 'land';
    case 'joker': return 'joker';
    case 'blank': return 'blank';
    default: return '';
  }
}

import legendImg from '../assets/cards/legend.png';
import realstateImg from '../assets/cards/realstate.png';
import landImg from '../assets/cards/land.png';
import jokerImg from '../assets/cards/joker.png';
import cardBackImg from '../assets/cards/card_back.png';
import blankImg from '../assets/cards/blank.png';
import { Modal, Button } from '@mui/material';

export default function GameBoard() {
  const { gameId } = useParams<{ gameId: string }>()
  const [flips, setFlips] = useState<(string | null)[]>(Array(48).fill(null))
  const [flipsCount, setFlipsCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [win, setWin] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)



  // Updated mutation to accept card index
  const { mutate, isLoading } = useMutation({
    mutationFn: (cardIndex: number) => flipCard(Number(gameId), cardIndex),
    onSuccess: (res, cardIndex) => {
      // Only update the clicked card's index
      setFlips(prev => {
        const updated = [...prev];
        updated[cardIndex] = res.flipped_card;
        return updated;
      });
      setFlipsCount(res.cards_flipped);
      setFinished(res.finished);
      setWin(res?.win_category ?? null);
      setError(null);
    },
    onError: () => {
      setError('Failed to flip card. Please try again.');
    }
  });

  // Card click now takes index
  const handleCardClick = (index: number) => {
    if (!flips[index] && flipsCount < 7 && !finished && !isLoading) {
      mutate(index)
    }
  }

  const navigate = useNavigate();
  const handleRestart = () => {
    navigate('/')
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{
      background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%), radial-gradient(circle at 20% 30%, rgba(0,255,255,0.08) 0%, transparent 80%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.10) 0%, transparent 80%)',
      backgroundBlendMode: 'screen, normal',
      backgroundAttachment: 'fixed',
      p: { xs: 1, md: 4 },
    }}>
      <Box p={4} display="flex" gap={4} flexWrap="wrap" sx={{
        bgcolor: 'rgba(30,34,90,0.97)',
        border: '2px solid #00ffc3',
        boxShadow: '0 0 40px 10px #00ffc3, 0 0 80px 20px #6c63ff33',
        borderRadius: 6,
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        flexWrap: 'wrap',
      }}>
        {/* Info Panel */}
        <Box flex={1} minWidth={260} maxWidth={320} sx={{
          bgcolor: 'rgba(20,24,50,0.85)',
          border: '2px solid #00ffc3',
          boxShadow: '0 0 24px 4px #00ffc366',
          borderRadius: 4,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography
            variant="h5"
            mb={2}
            sx={{
              color: '#00ffc3',
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: '0 0 12px #00ffc3',
              fontSize: 24,
              mb: 2,
            }}
          >
            Game Info
          </Typography>
          <Typography
            className="gaming-info"
            sx={{
              color: '#ffd700',
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 700,
              textShadow: '0 0 3px #b8860b, 0 1px 4px #0006',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: 17,
              mb: 1,
            }}
          >
            Cards Flipped: {flipsCount} / 7
          </Typography>
        <Typography
          className="gaming-info"
          sx={{
            color: '#1976d2',
            fontWeight: 700,
            letterSpacing: 0.5,
            textShadow: '0 2px 10px rgba(25,118,210,0.25)',
            background: 'rgba(25,118,210,0.04)',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: 17
          }}
        >
          Cards Left: {48 - flipsCount}
        </Typography>
        {finished && (
          <Modal
            open={finished}
            onClose={() => setFinished(false)}
            aria-labelledby="game-result-modal-title"
            aria-describedby="game-result-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(30,34,90,0.97)',
                border: '2px solid #00ffc3',
                boxShadow: '0 0 40px 10px #00ffc3, 0 0 80px 20px #6c63ff33',
                borderRadius: 6,
                p: 5,
                minWidth: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1500,
              }}
            >
              <Typography id="game-result-modal-title" variant="h3" gutterBottom sx={{
                color: win ? '#00ffc3' : '#ff4d6d',
                textShadow: win ? '0 0 18px #00ffc3' : '0 0 18px #ff4d6d',
                fontFamily: 'Orbitron, Arial, sans-serif',
                mb: 2,
              }}>
                {win ? '🏆 YOU WIN!' : '😢 GAME OVER'}
              </Typography>
              <Typography id="game-result-modal-description" variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
                {win ? `Prize: ${win}` : 'No win this time!'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #00ffc3 0%, #6c63ff 100%)',
                    color: '#222',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: '0 2px 12px #00ffc355',
                    fontFamily: 'Orbitron, Arial, sans-serif',
                  }}
                  onClick={() => navigate('/')}
                >
                  Start New Game
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#00ffc3',
                    color: '#00ffc3',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    fontFamily: 'Orbitron, Arial, sans-serif',
                  }}
                  onClick={() => setFinished(false)}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
        {error && (
          <Typography
          mt={2}
          color="error"
          sx={{
            color: '#e74c3c',
            fontWeight: 700,
            letterSpacing: 0.5,
            textShadow: '0 2px 10px rgba(231,76,60,0.18)',
            background: 'rgba(231,76,60,0.06)',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: 17
          }}
        >
          {error}
        </Typography>
        )}
        <Box mt={2}>
          <button style={{width: '100%', padding: 8, fontWeight: 600}} className="gaming-btn" onClick={handleRestart}>Start New Game</button>
        </Box>
        <Box mt={2} mb={1}>
          <Typography
          variant="h6"
          className="gaming-info"
          sx={{
            color: '#1976d2',
            fontWeight: 700,
            letterSpacing: 0.5,
            textShadow: '0 2px 10px rgba(25,118,210,0.25)',
            background: 'rgba(25,118,210,0.04)',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: 20
          }}
        >
          Winning Rules
        </Typography>
          <div
            className="gaming-info"
            style={{
              color: '#1976d2',
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: '0 2px 10px rgba(25,118,210,0.25)',
              background: 'rgba(25,118,210,0.04)',
              borderRadius: 8,
              padding: '12px 8px',
              fontSize: 17,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span style={{display:'flex',alignItems:'center',gap:8}}>
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:4}}>
    <img src={legendImg} alt="legend" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Legend</span>
  </span>
  x6 &nbsp;+
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginLeft:4,marginRight:4}}>
    <img src={jokerImg} alt="joker" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Joker</span>
  </span>
  <span>Epic Victory</span>
</span>
            <span style={{display:'flex',alignItems:'center',gap:8}}>
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:4}}>
    <img src={legendImg} alt="legend" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Legend</span>
  </span>
  x6 <span>Legendary Set</span>
</span>
            <span style={{display:'flex',alignItems:'center',gap:8}}>
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:4}}>
    <img src={legendImg} alt="legend" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Legend</span>
  </span>
  x5 &nbsp;+
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginLeft:4,marginRight:4}}>
    <img src={jokerImg} alt="joker" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Joker</span>
  </span>
  <span>Heroic Win</span>
</span>
            <span style={{display:'flex',alignItems:'center',gap:8}}>
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:4}}>
    <img src={legendImg} alt="legend" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Legend</span>
  </span>
  x4 &nbsp;+
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginLeft:4,marginRight:4}}>
    <img src={jokerImg} alt="joker" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Joker</span>
  </span>
  <span>Adventurer's Reward</span>
</span>
            <span style={{display:'flex',alignItems:'center',gap:8}}>
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:4}}>
    <img src={legendImg} alt="legend" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Legend</span>
  </span>
  x3 &nbsp;+
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',marginLeft:4,marginRight:4}}>
    <img src={jokerImg} alt="joker" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Joker</span>
  </span>
  <span>Explorer's Prize</span>
</span>
            <span style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
  (Same for
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',margin:'0 4px'}}>
    <img src={realstateImg} alt="real estate" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Real Estate</span>
  </span>
  and
  <span style={{display:'flex',flexDirection:'column',alignItems:'center',margin:'0 4px'}}>
    <img src={landImg} alt="land" style={{width:28,height:28,borderRadius:4,objectFit:'cover'}}/>
    <span style={{fontSize:11,marginTop:2}}>Land</span>
  </span>
  )
</span>
            </div>
          </Box>
        </Box>
        <Box flex={3}>
          <div className="game-table-bg" style={{
            background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%), radial-gradient(circle at 20% 30%, rgba(0,255,255,0.08) 0%, transparent 80%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.10) 0%, transparent 80%)',
            backgroundBlendMode: 'screen, normal',
            backgroundAttachment: 'fixed',
            borderRadius: 8,
            padding: '12px 8px',
            boxShadow: '0 0 40px 10px #00ffc3, 0 0 80px 20px #6c63ff33',
          }}>
            <Typography variant="h5" mb={2} sx={{
              color: '#00ffc3',
              fontFamily: 'Orbitron, Arial, sans-serif',
              textShadow: '0 0 12px #00ffc3',
            }}>
              Flip Cards
            </Typography>
            <Grid container spacing={2} mt={2}>
              {[...Array(48)].map((_, i) => (
                <Grid item xs={2} key={i}>
                  <div
                    className={`flip-card${flips[i] ? ' flipped' : ''}`}
                    style={{ height: 100, width: '100%', cursor: flips[i] || finished ? 'not-allowed' : 'pointer' }}
                    onClick={() => handleCardClick(i)}
                  >
                    <div className="flip-card-inner" style={{height: '100%', width: '100%'}}>
                      <div className="flip-card-front" style={{height: '100%', width: '100%'}}>
                        <img src={cardBackImg} alt="card back" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8}} />
                      </div>
                      <div className={`flip-card-back ${getCardCssClass(flips[i])}`}>
                        {(flips[i]||'').toLowerCase() === 'blank' ? (
                          <img src={blankImg} alt="blank card" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8}} />
                        ) : (
                          ['legend','real estate','land','joker'].includes((flips[i]||'').toLowerCase()) ? null : (
                            <>
                              <span style={{fontSize: 36, display: 'block'}}>{getCardSymbol(flips[i])}</span>
                              <Typography textAlign="center" fontSize={16} mt={1}>{flips[i]}</Typography>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
