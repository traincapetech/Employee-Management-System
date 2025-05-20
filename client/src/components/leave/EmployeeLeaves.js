import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Tabs, Tab, Box, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, IconButton, Button, Grid
} from '@mui/material';
import { Delete, CalendarToday } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';
import LeaveForm from './LeaveForm';
import ConfirmDialog from '../common/ConfirmDialog';

// TabPanel component for tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const EmployeeLeaves = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  
  // Fetch leave requests when component mounts
  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getEmployeeLeaves(user.sub);
      setLeaveRequests(data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelLeave = async () => {
    if (!leaveToDelete) return;
    
    try {
      // Assume backend supports a way to cancel/delete a leave request
      // If not implemented, you might need to adjust your backend
      await leaveService.updateLeaveStatus(leaveToDelete.id, 'CANCELED');
      
      toast.success('Leave request canceled successfully');
      
      // Update state to remove the canceled request
      setLeaveRequests(leaveRequests.filter(leave => leave.id !== leaveToDelete.id));
      
    } catch (error) {
      console.error('Error canceling leave request:', error);
      toast.error('Failed to cancel leave request');
    } finally {
      setConfirmOpen(false);
      setLeaveToDelete(null);
    }
  };

  // Filter leaves by status
  const pendingLeaves = leaveRequests.filter(leave => leave.status === 'PENDING');
  const approvedLeaves = leaveRequests.filter(leave => leave.status === 'APPROVED');
  const rejectedLeaves = leaveRequests.filter(leave => ['REJECTED', 'AUTO_REJECTED'].includes(leave.status));

  const getStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'PENDING':
        color = 'warning';
        break;
      case 'APPROVED':
        color = 'success';
        break;
      case 'REJECTED':
      case 'AUTO_REJECTED':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Leave Requests
      </Typography>
      
      <Grid container justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalendarToday />}
          onClick={() => setShowLeaveForm(!showLeaveForm)}
          sx={{ mb: 2 }}
        >
          {showLeaveForm ? 'Cancel' : 'Apply for Leave'}
        </Button>
      </Grid>
      
      {showLeaveForm && (
        <Box mb={4}>
          <LeaveForm 
            onSubmitSuccess={() => {
              fetchLeaveRequests();
              setShowLeaveForm(false);
            }} 
          />
        </Box>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave request tabs">
            <Tab label={`All (${leaveRequests.length})`} />
            <Tab label={`Pending (${pendingLeaves.length})`} />
            <Tab label={`Approved (${approvedLeaves.length})`} />
            <Tab label={`Rejected (${rejectedLeaves.length})`} />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* All Leaves */}
            <TabPanel value={tabValue} index={0}>
              {renderLeaveTable(leaveRequests)}
            </TabPanel>
            
            {/* Pending Leaves */}
            <TabPanel value={tabValue} index={1}>
              {renderLeaveTable(pendingLeaves)}
            </TabPanel>
            
            {/* Approved Leaves */}
            <TabPanel value={tabValue} index={2}>
              {renderLeaveTable(approvedLeaves)}
            </TabPanel>
            
            {/* Rejected Leaves */}
            <TabPanel value={tabValue} index={3}>
              {renderLeaveTable(rejectedLeaves)}
            </TabPanel>
          </>
        )}
      </Paper>
      
      {/* Confirm Dialog for leave cancellation */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancelLeave}
        title="Cancel Leave Request"
        content="Are you sure you want to cancel this leave request? This action cannot be undone."
      />
    </div>
  );
  
  function renderLeaveTable(leaves) {
    if (leaves.length === 0) {
      return (
        <Typography variant="body1" align="center" sx={{ py: 4 }}>
          No leave requests found.
        </Typography>
      );
    }
    
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request Date</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => {
              // Calculate duration
              const fromDate = new Date(leave.fromDate);
              const toDate = new Date(leave.toDate);
              const durationDays = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
              
              return (
                <TableRow key={leave.id}>
                  <TableCell>
                    {new Date(leave.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.toDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {durationDays} {durationDays === 1 ? 'day' : 'days'}
                  </TableCell>
                  <TableCell>
                    {leave.reason.length > 30 ? `${leave.reason.substring(0, 30)}...` : leave.reason}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(leave.status)}
                  </TableCell>
                  <TableCell>
                    {leave.status === 'PENDING' && (
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          setLeaveToDelete(leave);
                          setConfirmOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default EmployeeLeaves; 