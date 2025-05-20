import React, { useState } from 'react';
import { 
  Paper, Typography, TextField, Button, Grid, 
  FormControlLabel, Checkbox, Box, CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';

const LeaveForm = ({ onSubmitSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState('');
  const [overrideAutoReject, setOverrideAutoReject] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates.');
      return;
    }
    
    if (fromDate > toDate) {
      setError('From date cannot be after to date.');
      return;
    }
    
    if (!reason.trim()) {
      setError('Please provide a reason for your leave request.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const leaveRequest = {
        employeeId: user.sub,
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        reason,
        overrideAutoReject,
        status: 'PENDING', // Default status
        requestDate: new Date().toISOString().split('T')[0]
      };
      
      await leaveService.applyForLeave(leaveRequest);
      toast.success('Leave request submitted successfully');
      
      // Reset form
      setFromDate(null);
      setToDate(null);
      setReason('');
      setOverrideAutoReject(false);
      
      // Notify parent component
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Apply for Leave
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                renderInput={(params) => 
                  <TextField {...params} fullWidth required />
                }
                minDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={setToDate}
                renderInput={(params) => 
                  <TextField {...params} fullWidth required />
                }
                minDate={fromDate || new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Leave"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={overrideAutoReject}
                  onChange={(e) => setOverrideAutoReject(e.target.checked)}
                  color="primary"
                />
              }
              label="Override auto-reject (for urgent leaves)"
            />
            <Typography variant="caption" color="textSecondary" display="block">
              Check this if your leave request is urgent. Unchecked requests might be auto-rejected based on company policy.
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : 'Submit Request'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default LeaveForm; 