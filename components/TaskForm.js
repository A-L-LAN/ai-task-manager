import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Snackbar, MenuItem, Select, 
  FormControl, InputLabel, Card, CardContent, Box, Grid 
} from '@mui/material';
import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.9;

export default function TaskForm({ onAdd, onUpdate, editingTask, clearEditing }) {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [model, setModel] = useState(null);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    toxicity.load(threshold).then(setModel);
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.task);
      setCategory(editingTask.category || 'Work');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.due_date || '');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (model) {
      try {
        const predictions = await model.classify([task]);
        const toxicCategories = predictions
          .flatMap(pred => pred.results.filter(res => res.match).map(() => pred.label));

        if (toxicCategories.length > 0) {
          setError(`Task contains inappropriate content: ${toxicCategories.join(', ')}`);
          setSnackbarOpen(true);
          return;
        }
      } catch {
        setError('Error classifying the task. Please try again.');
        setSnackbarOpen(true);
        return;
      }
    }

    if (editingTask) {
      onUpdate(editingTask.id, task, category, priority, dueDate);
    } else {
      onAdd(task, category, priority, dueDate);
    }

    setTask('');
    setCategory('Work');
    setPriority('Medium');
    setDueDate('');
    setError('');
    clearEditing();
  };

  return (
    <Card elevation={3} sx={{  margin: 'auto', padding: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="New Task"
                variant="outlined"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                error={Boolean(error)}
                helperText={error}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value="Work">Work</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
              >
                {editingTask ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar 
        open={snackbarOpen}
        autoHideDuration={6000}
        message={error}
        onClose={() => setSnackbarOpen(false)}
      />
    </Card>
  );
}
