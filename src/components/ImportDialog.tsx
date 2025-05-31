import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useTuneContext } from '@/context/TuneContext';
import { parseABC } from '@/utils/abcUtils';
import { Tune } from '@/types/tune';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportDialog({ open, onClose }: ImportDialogProps) {
  const [importText, setImportText] = useState('');
  const { addTune, loadTunes } = useTuneContext();

  const handleImport = useCallback(async () => {
    const newTunes = importText.split(/(?=X:\s*\d+)/g)
      .filter(tune => tune.trim())
      .map(tuneAbc => {
        const parsedTune = parseABC(tuneAbc);
        if (!parsedTune.title || !parsedTune.type || !parsedTune.key) {
          throw new Error('Invalid ABC notation: missing required fields');
        }
        
        return {
          title: parsedTune.title,
          type: parsedTune.type,
          key: parsedTune.key,
          abc: tuneAbc.trim(),
          tags: [],
          difficulty: 3,
        } as Omit<Tune, 'id'>;
      });

    for (const tune of newTunes) {
      await addTune(tune);
    }

    await loadTunes();
    setImportText('');
    onClose();
  }, [importText, addTune, loadTunes, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import ABC Tunes</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          rows={12}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          fullWidth
          placeholder="Paste your ABC tunes here..."
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleImport}
          variant="contained"
          disabled={!importText.trim()}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
} 