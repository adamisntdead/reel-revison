import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Tune } from '@/types/tune';
import { useTuneContext } from '@/context/TuneContext';
import { parseABC } from '@/utils/abcUtils';
import TuneCard from '@/components/TuneCard';
import AddTuneDialog from '@/components/AddTuneDialog';

export default function TuneList() {
  const { state, addTune, loadTunes } = useTuneContext();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTunes();
  }, [loadTunes]);

  const handleSaveTune = useCallback(async (newTune: Omit<Tune, 'id'>) => {
    await addTune(newTune);
    setOpenDialog(false);
  }, [addTune]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Tunes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Tune
        </Button>
      </Box>

      <Grid container spacing={3}>
        {state.tunes.map((tune) => (
          <Grid item xs={12} sm={6} md={4} key={tune.id}>
            <TuneCard
              tune={tune}
              onClick={() => navigate(`/tune/${tune.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      <AddTuneDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTune}
      />
    </Box>
  );
} 