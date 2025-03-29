import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Tune, PracticeSession } from '@/types/tune';
import { getTunes, saveTunes } from '@/utils/storage';
import { getPracticeSessions, savePracticeSessions } from '@/utils/storage';
import abcjs from 'abcjs';

export default function Practice() {
  const [tunes, setTunes] = useState<Tune[]>([]);
  const [currentTune, setCurrentTune] = useState<Tune | null>(null);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadedTunes = getTunes();
    const loadedSessions = getPracticeSessions();
    setTunes(loadedTunes);
    setPracticeSessions(loadedSessions);
  }, []);

  useEffect(() => {
    if (currentTune) {
      abcjs.renderAbc('abcjs-container', currentTune.abc, {
        responsive: 'resize',
      });
    }
  }, [currentTune, showAnswer]);

  const getNextTune = () => {
    const now = new Date();
    const dueTunes = tunes.filter(
      (tune) =>
        !tune.nextReview || new Date(tune.nextReview) <= now
    );

    if (dueTunes.length === 0) {
      return null;
    }

    // Sort by next review date and difficulty
    dueTunes.sort((a, b) => {
      const aDate = a.nextReview ? new Date(a.nextReview) : new Date(0);
      const bDate = b.nextReview ? new Date(b.nextReview) : new Date(0);
      return aDate.getTime() - bDate.getTime();
    });

    return dueTunes[0];
  };

  const startPractice = () => {
    const nextTune = getNextTune();
    if (nextTune) {
      setCurrentTune(nextTune);
      setShowAnswer(false);
      setRating(null);
      setDuration(0);
      setNotes('');
    } else {
      setOpenDialog(true);
    }
  };

  const handleSubmit = () => {
    if (!currentTune || !rating) return;

    const session: PracticeSession = {
      id: crypto.randomUUID(),
      tuneId: currentTune.id,
      date: new Date(),
      duration,
      quality: rating as 1 | 2 | 3 | 4 | 5,
      notes,
    };

    // Update tune's next review date based on spaced repetition algorithm
    const updatedTune = { ...currentTune };
    const daysSinceLastPractice = currentTune.lastPracticed
      ? (new Date().getTime() - new Date(currentTune.lastPracticed).getTime()) /
        (1000 * 60 * 60 * 24)
      : 0;

    let interval;
    if (rating >= 4) {
      interval = Math.max(1, daysSinceLastPractice * 2);
    } else if (rating === 3) {
      interval = Math.max(1, daysSinceLastPractice * 1.5);
    } else {
      interval = 1;
    }

    updatedTune.lastPracticed = new Date();
    updatedTune.nextReview = new Date(
      new Date().getTime() + interval * 24 * 60 * 60 * 1000
    );

    // Update tunes and practice sessions
    const updatedTunes = tunes.map((tune) =>
      tune.id === currentTune.id ? updatedTune : tune
    );
    const updatedSessions = [...practiceSessions, session];

    setTunes(updatedTunes);
    setPracticeSessions(updatedSessions);
    saveTunes(updatedTunes);
    savePracticeSessions(updatedSessions);

    // Reset state
    setCurrentTune(null);
    setShowAnswer(false);
    setRating(null);
    setDuration(0);
    setNotes('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Practice Session
      </Typography>

      {!currentTune ? (
        <Button
          variant="contained"
          onClick={startPractice}
          disabled={tunes.length === 0}
        >
          Start Practice
        </Button>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {currentTune.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {currentTune.type} in {currentTune.key}
            </Typography>

            {!showAnswer ? (
              <Button
                variant="contained"
                onClick={() => setShowAnswer(true)}
                sx={{ mt: 2 }}
              >
                Show Tune
              </Button>
            ) : (
              <Box>
                <div id="abcjs-container" />
                <Box sx={{ mt: 3 }}>
                  <Typography component="legend">How well did you play?</Typography>
                  <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                  />
                </Box>
                <TextField
                  label="Practice Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Notes"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!rating || !duration}
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>No Tunes Due</DialogTitle>
        <DialogContent>
          <Typography>
            You're all caught up! No tunes are due for practice at the moment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 