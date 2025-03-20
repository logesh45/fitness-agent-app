import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function WorkoutPlan({ profileId }) {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles/${profileId}/workout-plan`);
      setWorkoutPlan(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setWorkoutPlan(null);
      } else {
        setError('Error fetching workout plan');
      }
    }
  };

  const generateWorkoutPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/profiles/${profileId}/workout-plan`);
      setWorkoutPlan(response.data);
      setError(null);
    } catch (error) {
      setError('Error generating workout plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchWorkoutPlan();
    }
  }, [profileId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!workoutPlan) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No workout plan found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={generateWorkoutPlan}
          sx={{ mt: 2 }}
        >
          Generate Workout Plan
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your 3-Week Workout Plan
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {new Date(workoutPlan.start_date).toLocaleDateString()} - {new Date(workoutPlan.end_date).toLocaleDateString()}
      </Typography>

      {workoutPlan.plan_data.weeks.map((week) => (
        <Accordion key={week.week_number}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Week {week.week_number}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {week.days.map((day) => (
                <Grid item xs={12} key={day.day_number}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Day {day.day_number}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {day.exercises.map((exercise, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              <Chip 
                                label={exercise.type} 
                                size="small" 
                                color="primary" 
                                sx={{ mr: 1 }}
                              />
                              {exercise.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {exercise.sets && exercise.reps 
                                ? `${exercise.sets} sets of ${exercise.reps} reps`
                                : exercise.duration 
                                  ? `Duration: ${exercise.duration}`
                                  : ''}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={generateWorkoutPlan}
        sx={{ mt: 3 }}
      >
        Generate New Plan
      </Button>
    </Paper>
  );
}
