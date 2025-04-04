import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, MusicNote as MusicNoteIcon, Code as CodeIcon } from '@mui/icons-material';
import { Tune, PracticeSession } from '@/types/tune';
import { getTunes, saveTunes } from '@/utils/storage';
import { getPracticeSessions } from '@/utils/storage';
import { parseABC } from '@/utils/abcUtils';
import abcjs from 'abcjs';

export default function TuneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tune, setTune] = useState<Tune | null>(null);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTune, setEditingTune] = useState<Tune | null>(null);
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');

  useEffect(() => {
    const loadedTunes = getTunes();
    const loadedSessions = getPracticeSessions();
    const foundTune = loadedTunes.find((t) => t.id === id);
    if (foundTune) {
      setTune(foundTune);
    } else {
      navigate('/');
    }
    setPracticeSessions(loadedSessions.filter((s) => s.tuneId === id));
  }, [id, navigate]);

  useEffect(() => {
    if (tune && viewMode === 'rendered') {
      abcjs.renderAbc('abcjs-container', tune.abc, {
        responsive: 'resize',
      });
    }
  }, [tune, viewMode]);

  const handleEditTune = () => {
    if (tune) {
      setEditingTune({ ...tune });
      setOpenDialog(true);
    }
  };

  const handleSaveTune = () => {
    if (!tune || !editingTune) return;

    const allTunes = getTunes();
    const updatedTunes = allTunes.map((t) =>
      t.id === tune.id ? editingTune : t
    );

    saveTunes(updatedTunes);
    setTune(editingTune);
    setOpenDialog(false);
    setEditingTune(null);
  };

  const handleDeleteTune = () => {
    if (!tune) return;
    
    const allTunes = getTunes();
    const updatedTunes = allTunes.filter((t) => t.id !== tune.id);
    saveTunes(updatedTunes);
    setOpenDialog(false);
    navigate('/');
  };

  if (!tune) {
    return null;
  }

  const tuneSessions = practiceSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{tune.title}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="rendered">
              <MusicNoteIcon sx={{ mr: 1 }} />
              Rendered
            </ToggleButton>
            <ToggleButton value="raw">
              <CodeIcon sx={{ mr: 1 }} />
              Raw ABC
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditTune}
          >
            Edit Tune
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {tune.type} in {tune.key}
              </Typography>
              <Box sx={{ mt: 1, mb: 2 }}>
                {tune.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Difficulty: {tune.difficulty}/5
              </Typography>
              {tune.nextReview && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next review: {new Date(tune.nextReview).toLocaleDateString()}
                </Typography>
              )}
              {viewMode === 'rendered' ? (
                <div id="abcjs-container" />
              ) : (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '500px',
                    overflow: 'auto',
                  }}
                >
                  {tune.abc}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Practice Sessions
              </Typography>
              {tuneSessions.length > 0 ? (
                <Box>
                  {tuneSessions.map((session) => (
                    <Box key={session.id} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(session.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Duration: {session.duration} minutes
                      </Typography>
                      <Typography variant="body2">
                        Quality: {session.quality}/5
                      </Typography>
                      {session.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Notes: {session.notes}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No practice sessions recorded yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tune</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="ABC Notation"
              value={editingTune?.abc || ''}
              onChange={(e) => {
                const abc = e.target.value;
                const abcData = parseABC(abc);
                setEditingTune(prev => prev ? { ...prev, ...abcData, abc } : null);
              }}
              multiline
              rows={8}
              fullWidth
              helperText="Enter the ABC notation. Title, type, and key will be automatically extracted from the header."
            />
            <TextField
              label="Difficulty (1-5)"
              type="number"
              value={editingTune?.difficulty || 3}
              onChange={(e) => setEditingTune(prev => prev ? { ...prev, difficulty: Number(e.target.value) as Tune['difficulty'] } : null)}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              value={editingTune?.tags?.join(', ') || ''}
              onChange={(e) => setEditingTune(prev => prev ? { ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) } : null)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteTune} 
            color="error" 
            startIcon={<DeleteIcon />}
            sx={{ mr: 'auto' }}
          >
            Delete
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTune} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 