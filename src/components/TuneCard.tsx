import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Tune } from '@/types/tune';

interface TuneCardProps {
  tune: Tune;
  onClick: () => void;
}

export default function TuneCard({ tune, onClick }: TuneCardProps) {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={onClick}
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
  );
} 