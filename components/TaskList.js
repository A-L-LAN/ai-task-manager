import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function TaskList({ tasks = [], onDelete, onEdit }) {
  // Define priority order
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  // Sort tasks by priority before rendering
  const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <List sx={{ width: '95%', margin: 'auto' }}>
      {sortedTasks.map((task) => (
        <Paper
          key={task.id}
          elevation={3}
          sx={{
            padding: 2,
            marginBottom: 2,
            borderRadius: 2,
            transition: '0.3s',
            '&:hover': {
              boxShadow: 6,
              transform: 'scale(1.02)',
            },
          }}
        >
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <ListItemText
              primary={task.task}
              secondary={`Category: ${task.category} | Priority: ${task.priority} | Due: ${task.due_date || "No deadline"}`}
            />
            <div>
              <IconButton  edge="end" aria-label="edit" onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}
