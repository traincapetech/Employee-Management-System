import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';
import { toast } from 'react-toastify';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch recent attendance data
          const attendance = await attendanceService.getAttendanceReport(user.sub);
          setAttendanceData(attendance || []);
          
          // Check if already clocked in today
          const today = new Date().toISOString().split('T')[0];
          const todayAttendance = attendance?.find(a => 
            new Date(a.date).toISOString().split('T')[0] === today && a.checkInTime
          );
          setClockedIn(!!todayAttendance && !todayAttendance.checkOutTime);
          
          // Fetch leave requests
          const leaves = await leaveService.getEmployeeLeaves(user.sub);
          setLeaveData(leaves || []);
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

  const handleCheckIn = async () => {
    try {
      const currentTime = new Date().toISOString().substr(11, 8); // HH:MM:SS format
      await attendanceService.checkIn(user.sub, currentTime);
      setClockedIn(true);
      toast.success('Checked in successfully');
      
      // Refresh attendance data
      const attendance = await attendanceService.getAttendanceReport(user.sub);
      setAttendanceData(attendance || []);
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const currentTime = new Date().toISOString().substr(11, 8); // HH:MM:SS format
      await attendanceService.checkOut(user.sub, currentTime);
      setClockedIn(false);
      toast.success('Checked out successfully');
      
      // Refresh attendance data
      const attendance = await attendanceService.getAttendanceReport(user.sub);
      setAttendanceData(attendance || []);
    } catch (error) {
      console.error('Check-out error:', error);
      toast.error('Failed to check out');
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  // Get recent attendance (last 5 entries)
  const recentAttendance = [...attendanceData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Get pending leave requests
  const pendingLeaves = leaveData
    .filter(leave => leave.status === 'PENDING')
    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Employee Dashboard
        </Typography>
      </Grid>
      
      {/* Attendance Action Card */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Today's Attendance
          </Typography>
          <Typography variant="body1" paragraph>
            {clockedIn ? 'You are currently clocked in.' : 'You have not clocked in today.'}
          </Typography>
          
          <Button 
            variant="contained" 
            color={clockedIn ? "secondary" : "primary"}
            onClick={clockedIn ? handleCheckOut : handleCheckIn}
            fullWidth
          >
            {clockedIn ? 'Check Out' : 'Check In'}
          </Button>
        </Paper>
      </Grid>
      
      {/* Quick Stats Card */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Quick Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Attendance This Month
              </Typography>
              <Typography variant="h5">
                {attendanceData.filter(a => 
                  new Date(a.date).getMonth() === new Date().getMonth() &&
                  ['PRESENT', 'WORK_FROM_HOME'].includes(a.status)
                ).length} days
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Pending Leaves
              </Typography>
              <Typography variant="h5">
                {pendingLeaves.length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Recent Attendance */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Attendance
          </Typography>
          {recentAttendance.length > 0 ? (
            <div>
              {recentAttendance.map((record, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <Grid container alignItems="center">
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {new Date(record.date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="textSecondary">
                          Status: <span style={{ color: record.status === 'PRESENT' ? 'green' : 
                                              record.status === 'ABSENT' ? 'red' : 'orange' }}>
                            {record.status}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="textSecondary">
                          {record.checkInTime && 
                            `${record.checkInTime} - ${record.checkOutTime || 'No checkout'}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Typography variant="body1">No recent attendance records found.</Typography>
          )}
        </Paper>
      </Grid>
      
      {/* Recent Leave Requests */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Leave Requests
          </Typography>
          {pendingLeaves.length > 0 ? (
            <div>
              {pendingLeaves.slice(0, 3).map((leave, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="textSecondary">
                          Status: <span style={{ color: 
                              leave.status === 'APPROVED' ? 'green' : 
                              leave.status === 'REJECTED' ? 'red' : 'orange' }}>
                            {leave.status}
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          Reason: {leave.reason.substring(0, 15)}...
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Typography variant="body1">No pending leave requests found.</Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard; 