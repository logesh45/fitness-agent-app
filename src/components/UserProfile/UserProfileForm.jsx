import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox,
  Typography,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import WorkoutPlan from '../WorkoutPlan/WorkoutPlan';

const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Bench',
  'Kettlebell',
  'None (Bodyweight only)'
];

const FITNESS_GOALS = [
  'Build Muscle',
  'Lose Weight',
  'Improve Endurance',
  'Increase Strength',
  'General Fitness'
];

const WORKOUT_TYPES = [
  'Strength Training',
  'HIIT',
  'Calisthenics',
  'Circuit Training',
  'Cardio'
];

const API_BASE_URL = 'http://localhost:5000/api';

export default function UserProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    fitnessGoal: '',
    equipment: [],
    workoutTypes: [],
    experienceLevel: 'beginner'
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [profileId, setProfileId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipmentChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      equipment: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleWorkoutTypesChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      workoutTypes: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/profiles`, formData);
      setProfileId(response.data.id);
      setSnackbar({
        open: true,
        message: 'Profile created successfully!',
        severity: 'success'
      });
      console.log('Profile created:', response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error creating profile',
        severity: 'error'
      });
      console.error('Error creating profile:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Fitness Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Fitness Goal</InputLabel>
            <Select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              label="Fitness Goal"
            >
              {FITNESS_GOALS.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  {goal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Available Equipment</InputLabel>
            <Select
              multiple
              name="equipment"
              value={formData.equipment}
              onChange={handleEquipmentChange}
              label="Available Equipment"
              renderValue={(selected) => selected.join(', ')}
            >
              {EQUIPMENT_OPTIONS.map((item) => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={formData.equipment.indexOf(item) > -1} />
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Workout Types</InputLabel>
            <Select
              multiple
              name="workoutTypes"
              value={formData.workoutTypes}
              onChange={handleWorkoutTypesChange}
              label="Workout Types"
              renderValue={(selected) => selected.join(', ')}
            >
              {WORKOUT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={formData.workoutTypes.indexOf(type) > -1} />
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Experience Level</InputLabel>
            <Select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              label="Experience Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3 }}
          >
            Create Profile
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>

      {profileId && <WorkoutPlan profileId={profileId} />}
    </Box>
  );
}
