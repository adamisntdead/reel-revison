import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { Tune } from '@/types/tune';
import { parseABC } from '@/utils/abcUtils';

interface AddTuneDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (tune: Omit<Tune, 'id'>) => void;
}

export default function AddTuneDialog({ open, onClose, onSave }: AddTuneDialogProps) {
  const [newTune, setNewTune] = useState<Omit<Tune, 'id'>>({
    title: '',
    type: 'reel',
    key: 'D',
    abc: '',
    difficulty: 3,
    tags: [],
  });

  const handleSave = useCallback(() => {
    onSave(newTune);
    setNewTune({
      title: '',
      type: 'reel',
      key: 'D',
      abc: '',
      difficulty: 3,
      tags: [],
    });
  }, [newTune, onSave]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
} 