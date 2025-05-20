import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';
import leaveService from '../../services/leaveService';
import attendanceService from '../../services/attendanceService';
import { toast } from 'react-toastify';

const HrDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState({ present: 0, absent: 0, remote: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch all employees
          const employeeData = await employeeService.getAllEmployees();
          setEmployees(employeeData || []);
          
          // Fetch pending leave requests
          const leaves = await leaveService.getHrLeaves(user.sub);
          const pending = leaves?.filter(l => l.status === 'PENDING') || [];
          setPendingLeaves(pending);
          
          // Get today's date for attendance query
          const today = new Date().toISOString().split('T')[0];
          
          // Fetch attendance for today
          const attendance = await attendanceService.getAttendanceForDateRange(today, today);
          
          // Count different attendance statuses
          const present = attendance?.filter(a => a.status === 'PRESENT').length || 0;
          const absent = attendance?.filter(a => a.status === 'ABSENT').length || 0;
          const remote = attendance?.filter(a => a.status === 'WORK_FROM_HOME').length || 0;
          
          setTodayAttendance({ present, absent, remote });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error('Failed to load dashboard data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, 'APPROVED');
      // Update the local state to remove approved leave
      setPendingLeaves(pendingLeaves.filter(leave => leave.id !== leaveId));
      toast.success('Leave request approved');
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error('Failed to approve leave request');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, 'REJECTED');
      // Update the local state to remove rejected leave
      setPendingLeaves(pendingLeaves.filter(leave => leave.id !== leaveId));
      toast.success('Leave request rejected');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('Failed to reject leave request');
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          HR Dashboard
        </Typography>
      </Grid>
      
      {/* Quick Stats Cards */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Employee Statistics
          </Typography>
          <Typography variant="h3" align="center" sx={{ my: 2 }}>
            {employees.length}
          </Typography>
          <Typography variant="body1" align="center">
            Total Employees
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/employees')}
          >
            View All Employees
          </Button>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Today's Attendance
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <Typography variant="h5" align="center" color="green">
                {todayAttendance.present}
              </Typography>
              <Typography variant="body2" align="center">
                Present
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" align="center" color="red">
                {todayAttendance.absent}
              </Typography>
              <Typography variant="body2" align="center">
                Absent
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" align="center" color="blue">
                {todayAttendance.remote}
              </Typography>
              <Typography variant="body2" align="center">
                Remote
              </Typography>
            </Grid>
          </Grid>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => navigate('/attendance')}
          >
            View Attendance Records
          </Button>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Leave Requests
          </Typography>
          <Typography variant="h3" align="center" sx={{ my: 2 }}>
            {pendingLeaves.length}
          </Typography>
          <Typography variant="body1" align="center">
            Pending Approvals
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/leave-requests')}
          >
            Manage Leave Requests
          </Button>
        </Paper>
      </Grid>
      
      {/* Pending Leave Requests */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pending Leave Requests
          </Typography>
          {pendingLeaves.length > 0 ? (
            <div>
              {pendingLeaves.slice(0, 5).map((leave, index) => {
                // Find the employee for this leave request
                const employee = employees.find(emp => emp.id === leave.employeeId) || {};
                
                return (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle1">
                            {employee.fullName || 'Unknown Employee'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {employee.department || 'No department'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            From: {new Date(leave.fromDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            To: {new Date(leave.toDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            Reason: {leave.reason}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                size="small"
                                fullWidth
                                onClick={() => handleApproveLeave(leave.id)}
                              >
                                Approve
                              </Button>
                            </Grid>
                            <Grid item xs={6}>
                              <Button 
                                variant="outlined" 
                                color="error" 
                                size="small"
                                fullWidth
                                onClick={() => handleRejectLeave(leave.id)}
                              >
                                Reject
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
              {pendingLeaves.length > 5 && (
                <Button 
                  variant="text" 
                  onClick={() => navigate('/leave-requests')}
                  sx={{ mt: 1 }}
                >
                  View All {pendingLeaves.length} Requests
                </Button>
              )}
            </div>
          ) : (
            <Typography variant="body1">No pending leave requests.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HrDashboard; 