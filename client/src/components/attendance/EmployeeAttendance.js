import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Grid, Button, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { CheckCircle, Cancel, Home } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  
  useEffect(() => {
    if (user) {
      fetchAttendanceData();
      checkTodayAttendance();
    }
  }, [user, month]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Get the first and last day of the selected month
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      // Format dates for API
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      const data = await attendanceService.getAttendanceReport(user.sub);
      
      // Filter for selected month
      const filteredData = data ? data.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= firstDay && recordDate <= lastDay;
      }) : [];
      
      // Sort by date descending
      filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAttendanceData(filteredData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const data = await attendanceService.getAttendanceReport(user.sub);
      
      if (!data) return;
      
      // Look for today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = data.find(record => 
        new Date(record.date).toISOString().split('T')[0] === today
      );
      
      if (todayAttendance) {
        setCurrentAttendance(todayAttendance);
        setClockedIn(!!todayAttendance.checkInTime && !todayAttendance.checkOutTime);
      }
    } catch (error) {
      console.error('Error checking today attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      const currentTime = new Date().toISOString().substr(11, 8);
      await attendanceService.checkIn(user.sub, currentTime);
      toast.success('Checked in successfully');
      setClockedIn(true);
      checkTodayAttendance();
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const currentTime = new Date().toISOString().substr(11, 8);
      await attendanceService.checkOut(user.sub, currentTime);
      toast.success('Checked out successfully');
      setClockedIn(false);
      checkTodayAttendance();
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Failed to check out');
    }
  };

  // Calculate monthly attendance stats
  const calculateStats = () => {
    if (!attendanceData.length) {
      return {
        present: 0,
        absent: 0,
        wfh: 0,
        onLeave: 0,
        totalDays: 0
      };
    }
    
    const present = attendanceData.filter(record => record.status === 'PRESENT').length;
    const absent = attendanceData.filter(record => record.status === 'ABSENT').length;
    const wfh = attendanceData.filter(record => record.status === 'WORK_FROM_HOME').length;
    const onLeave = attendanceData.filter(record => record.status === 'ON_LEAVE').length;
    
    return {
      present,
      absent,
      wfh,
      onLeave,
      totalDays: present + absent + wfh + onLeave
    };
  };

  // Get status icon for table
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle style={{ color: 'green' }} />;
      case 'ABSENT':
        return <Cancel style={{ color: 'red' }} />;
      case 'WORK_FROM_HOME':
        return <Home style={{ color: 'blue' }} />;
      default:
        return null;
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Attendance
      </Typography>

      {/* Today's Attendance Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Today's Attendance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              {currentAttendance ? (
                <Typography variant="body1">
                  Current Status: <span style={{ 
                    fontWeight: 'bold',
                    color: currentAttendance.status === 'PRESENT' ? 'green' : 
                          currentAttendance.status === 'ABSENT' ? 'red' : 'blue'
                  }}>
                    {currentAttendance.status}
                  </span>
                  {currentAttendance.checkInTime && (
                    <>
                      <br />
                      Check-in Time: {currentAttendance.checkInTime}
                    </>
                  )}
                  {currentAttendance.checkOutTime && (
                    <>
                      <br />
                      Check-out Time: {currentAttendance.checkOutTime}
                    </>
                  )}
                </Typography>
              ) : (
                <Typography variant="body1">
                  You have not marked attendance for today.
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color={clockedIn ? "secondary" : "primary"}
              fullWidth
              onClick={clockedIn ? handleCheckOut : handleCheckIn}
            >
              {clockedIn ? 'Check Out' : 'Check In'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Monthly Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Monthly Overview
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['month', 'year']}
                label="Select Month"
                minDate={new Date('2000-01-01')}
                maxDate={new Date()}
                value={month}
                onChange={(newDate) => setMonth(newDate)}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {month.toLocaleString('default', { month: 'long' })} {month.getFullYear()} Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: '#e8f5e9' }}>
                  <CardContent sx={{ py: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">{stats.present}</Typography>
                    <Typography variant="body2">Present</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: '#ffebee' }}>
                  <CardContent sx={{ py: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">{stats.absent}</Typography>
                    <Typography variant="body2">Absent</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: '#e3f2fd' }}>
                  <CardContent sx={{ py: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">{stats.wfh}</Typography>
                    <Typography variant="body2">WFH</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: '#fff8e1' }}>
                  <CardContent sx={{ py: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.dark">{stats.onLeave}</Typography>
                    <Typography variant="body2">Leave</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Records Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Records
        </Typography>
        {attendanceData.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell>Check-out</TableCell>
                  <TableCell>Total Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record) => {
                  // Calculate total hours
                  let totalHours = '';
                  if (record.checkInTime && record.checkOutTime) {
                    const checkIn = new Date(`2000-01-01T${record.checkInTime}`);
                    const checkOut = new Date(`2000-01-01T${record.checkOutTime}`);
                    const diff = (checkOut - checkIn) / (1000 * 60 * 60);
                    totalHours = `${diff.toFixed(1)} hrs`;
                  }
                  
                  return (
                    <TableRow key={record.id || record.date}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(record.status)}
                          <span style={{ marginLeft: '8px' }}>{record.status}</span>
                        </Box>
                      </TableCell>
                      <TableCell>{record.checkInTime || '-'}</TableCell>
                      <TableCell>{record.checkOutTime || '-'}</TableCell>
                      <TableCell>{totalHours || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">
            No attendance records found for {month.toLocaleString('default', { month: 'long' })} {month.getFullYear()}.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default EmployeeAttendance; 