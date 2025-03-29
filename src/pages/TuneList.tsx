import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Download as DownloadIcon } from '@mui/icons-material';
import { Tune } from '@/types/tune';
import { getTunes, saveTunes } from '@/utils/storage';
import { parseABC, exportTunebook } from '@/utils/abcUtils';

export default function TuneList() {
  const [tunes, setTunes] = useState<Tune[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTune, setNewTune] = useState<Partial<Tune>>({
    title: '',
    type: 'reel',
    key: 'D',
    abc: '',
    difficulty: 3,
    tags: [],
  });
  const navigate = useNavigate();

  // Load tunes whenever the component mounts or when localStorage changes
  useEffect(() => {
    const loadTunes = () => {
      const loadedTunes = getTunes();
      console.log('Loading tunes in TuneList:', loadedTunes);
      setTunes(loadedTunes);
    };

    loadTunes();
    // Listen for storage changes
    window.addEventListener('storage', loadTunes);
    return () => window.removeEventListener('storage', loadTunes);
  }, []);

  const handleSaveTune = () => {
    // Parse ABC notation to extract metadata
    const abcData = parseABC(newTune.abc || '');
    
    const newTuneWithId = {
      ...newTune,
      ...abcData,
      id: crypto.randomUUID(),
    } as Tune;
    
    const updatedTunes = [...tunes, newTuneWithId];
    setTunes(updatedTunes);
    saveTunes(updatedTunes);
    setOpenDialog(false);
    setNewTune({
      title: '',
      type: 'reel',
      key: 'D',
      abc: '',
      difficulty: 3,
      tags: [],
    });
  };

  const handleExportTunebook = () => {
    const abcContent = exportTunebook(tunes);
    const blob = new Blob([abcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-tunebook.abc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Tunes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setNewTune({
              title: '',
              type: 'reel',
              key: 'D',
              abc: '',
              difficulty: 3,
              tags: [],
            });
            setOpenDialog(true);
          }}
        >
          Add Tune
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tunes.map((tune) => (
          <Grid item xs={12} sm={6} md={4} key={tune.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(`/tune/${tune.id}`)}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {tune.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {tune.type} in {tune.key}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {tune.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Difficulty: {tune.difficulty}/5
                </Typography>
                {tune.nextReview && (
                  <Typography variant="body2" color="text.secondary">
                    Next review: {new Date(tune.nextReview).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Tune</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="ABC Notation"
              value={newTune.abc}
              onChange={(e) => {
                const abc = e.target.value;
                const abcData = parseABC(abc);
                setNewTune({ ...newTune, ...abcData, abc });
              }}
              multiline
              rows={8}
              fullWidth
              helperText="Enter the ABC notation. Title, type, and key will be automatically extracted from the header."
            />
            <TextField
              label="Difficulty (1-5)"
              type="number"
              value={newTune.difficulty}
              onChange={(e) => setNewTune({ ...newTune, difficulty: Number(e.target.value) as Tune['difficulty'] })}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              value={newTune.tags?.join(', ') || ''}
              onChange={(e) => setNewTune({ ...newTune, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTune} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 