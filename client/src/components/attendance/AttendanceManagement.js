import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Grid, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';

const AttendanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markAttendanceMode, setMarkAttendanceMode] = useState(false);
  const [bulkAttendance, setBulkAttendance] = useState([]);
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForDate = async (date) => {
    try {
      setLoading(true);
      
      // Format date to ISO string for API
      const formattedDate = date.toISOString().split('T')[0];
      
      // Get attendance for this date range (single day)
      const data = await attendanceService.getAttendanceForDateRange(
        formattedDate,
        formattedDate
      );
      
      setAttendanceData(data || []);
      
      // Initialize bulk attendance states for all employees
      if (employees.length > 0) {
        const initialBulkAttendance = employees.map(emp => {
          // Find if attendance already exists for this employee
          const existingAttendance = data ? data.find(a => a.employeeId === emp.id) : null;
          
          return {
            employeeId: emp.id,
            status: existingAttendance ? existingAttendance.status : 'PRESENT',
            checkInTime: existingAttendance?.checkInTime || '09:00:00',
            checkOutTime: existingAttendance?.checkOutTime || '18:00:00'
          };
        });
        
        setBulkAttendance(initialBulkAttendance);
      }
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAttendanceChange = (employeeId, field, value) => {
    setBulkAttendance(prev => 
      prev.map(item => 
        item.employeeId === employeeId 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };

  const handleMarkAttendance = async () => {
    try {
      setLoading(true);
      
      // Process each employee's attendance
      for (const attendance of bulkAttendance) {
        if (attendance.status) {
          // Mark attendance status
          await attendanceService.markAttendance(
            attendance.employeeId, 
            attendance.status
          );
          
          // Only set check-in and check-out times for PRESENT or WORK_FROM_HOME
          if (['PRESENT', 'WORK_FROM_HOME'].includes(attendance.status)) {
            if (attendance.checkInTime) {
              await attendanceService.checkIn(
                attendance.employeeId,
                attendance.checkInTime
              );
            }
            
            if (attendance.checkOutTime) {
              await attendanceService.checkOut(
                attendance.employeeId,
                attendance.checkOutTime
              );
            }
          }
        }
      }
      
      toast.success('Attendance marked successfully');
      fetchAttendanceForDate(selectedDate);
      setMarkAttendanceMode(false);
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.fullName : 'Unknown Employee';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'green';
      case 'ABSENT': return 'red';
      case 'WORK_FROM_HOME': return 'blue';
      case 'ON_LEAVE': return 'orange';
      default: return 'inherit';
    }
  };

  if (loading && !markAttendanceMode) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            {!markAttendanceMode ? (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setMarkAttendanceMode(true)}
              >
                Mark Attendance
              </Button>
            ) : (
              <>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleMarkAttendance}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setMarkAttendanceMode(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {markAttendanceMode ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mark Attendance for {selectedDate.toLocaleDateString()}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check-in Time</TableCell>
                  <TableCell>Check-out Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bulkAttendance.map((item) => (
                  <TableRow key={item.employeeId}>
                    <TableCell>{getEmployeeName(item.employeeId)}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={item.status}
                          onChange={(e) => handleBulkAttendanceChange(
                            item.employeeId, 
                            'status', 
                            e.target.value
                          )}
                          label="Status"
                        >
                          <MenuItem value="PRESENT">Present</MenuItem>
                          <MenuItem value="ABSENT">Absent</MenuItem>
                          <MenuItem value="WORK_FROM_HOME">Work From Home</MenuItem>
                          <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        size="small"
                        value={item.checkInTime ? item.checkInTime.substring(0, 5) : '09:00'}
                        onChange={(e) => handleBulkAttendanceChange(
                          item.employeeId, 
                          'checkInTime', 
                          e.target.value + ':00'
                        )}
                        disabled={!['PRESENT', 'WORK_FROM_HOME'].includes(item.status)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        size="small"
                        value={item.checkOutTime ? item.checkOutTime.substring(0, 5) : '18:00'}
                        onChange={(e) => handleBulkAttendanceChange(
                          item.employeeId, 
                          'checkOutTime',
                          e.target.value + ':00'
                        )}
                        disabled={!['PRESENT', 'WORK_FROM_HOME'].includes(item.status)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attendance for {selectedDate.toLocaleDateString()}
          </Typography>
          
          {attendanceData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Check-in Time</TableCell>
                    <TableCell>Check-out Time</TableCell>
                    <TableCell>Total Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((record) => {
                    // Calculate total hours if both check-in and check-out are present
                    let totalHours = '';
                    if (record.checkInTime && record.checkOutTime) {
                      const checkIn = new Date(`2000-01-01T${record.checkInTime}`);
                      const checkOut = new Date(`2000-01-01T${record.checkOutTime}`);
                      const diff = (checkOut - checkIn) / (1000 * 60 * 60);
                      totalHours = `${diff.toFixed(1)} hrs`;
                    }
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                        <TableCell>
                          <span style={{
                            color: getStatusColor(record.status),
                            fontWeight: 500
                          }}>
                            {record.status}
                          </span>
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
              No attendance records found for this date.
            </Typography>
          )}
        </Paper>
      )}
    </div>
  );
};

export default AttendanceManagement; 