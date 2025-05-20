import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, TextField, Button, Grid, 
  CircularProgress, TableContainer, Table, TableBody,
  TableCell, TableRow, TableHead, Divider, Card, 
  CardContent, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import { PictureAsPdf, Print, Email } from '@mui/icons-material';

const SalarySlipGenerator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [salaryData, setSalaryData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return { 
      value: i, 
      label: date.toLocaleString('default', { month: 'long' }) 
    };
  });

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setSalaryData(null); // Reset salary data when employee changes
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    setSalaryData(null); // Reset salary data when month changes
  };

  const handleGenerateSalarySlip = async () => {
    if (!selectedEmployee || !selectedMonth) {
      toast.error('Please select both employee and month');
      return;
    }
    
    try {
      setGenerating(true);
      
      // Get employee details
      const employee = employees.find(emp => emp.id === selectedEmployee);
      setEmployeeData(employee);
      
      // Get month and year from selected date
      const month = selectedMonth.getMonth() + 1; // 1-12
      const year = selectedMonth.getFullYear();
      
      // Calculate salary from attendance
      const salary = await attendanceService.calculateMonthlySalary(selectedEmployee, month, year);
      
      // Create sample salary slip data
      const baseSalary = employee.salary || 0;
      const attendanceDeduction = baseSalary - salary;
      
      // Sample calculations (you may adjust these based on your business logic)
      const basicSalary = baseSalary * 0.6;
      const hra = baseSalary * 0.3;
      const conveyanceAllowance = baseSalary * 0.05;
      const medicalAllowance = baseSalary * 0.05;
      
      // Deductions
      const providentFund = baseSalary * 0.12;
      const incomeTax = baseSalary * 0.1;
      const professionalTax = 200;
      
      const totalEarnings = basicSalary + hra + conveyanceAllowance + medicalAllowance;
      const totalDeductions = providentFund + incomeTax + professionalTax + attendanceDeduction;
      const netSalary = totalEarnings - totalDeductions;
      
      setSalaryData({
        employeeName: employee.fullName,
        employeeId: employee.id,
        designation: employee.role,
        department: employee.department,
        month: selectedMonth.toLocaleString('default', { month: 'long' }),
        year: selectedMonth.getFullYear(),
        baseSalary,
        attendanceDeduction,
        earnings: {
          basicSalary,
          hra,
          conveyanceAllowance,
          medicalAllowance,
          totalEarnings
        },
        deductions: {
          providentFund,
          incomeTax,
          professionalTax,
          attendanceDeduction,
          totalDeductions
        },
        netSalary
      });
      
      toast.success('Salary slip generated successfully');
      
    } catch (error) {
      console.error('Error generating salary slip:', error);
      toast.error('Failed to generate salary slip');
    } finally {
      setGenerating(false);
    }
  };

  // Function to format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Salary Slip Generator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="employee-select-label">Select Employee</InputLabel>
              <Select
                labelId="employee-select-label"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                label="Select Employee"
                disabled={loading}
              >
                {employees.map(employee => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Month"
                views={['month', 'year']}
                value={selectedMonth}
                onChange={handleMonthChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateSalarySlip}
              disabled={!selectedEmployee || !selectedMonth || generating}
              fullWidth
            >
              {generating ? <CircularProgress size={24} /> : 'Generate Salary Slip'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {salaryData && employeeData && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="h5">
                Salary Slip - {salaryData.month} {salaryData.year}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button 
                variant="outlined" 
                startIcon={<PictureAsPdf />} 
                sx={{ mr: 1 }}
              >
                Export PDF
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Print />}
              >
                Print
              </Button>
            </Grid>
          </Grid>
          
          {/* Employee Details Section */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Employee Name</Typography>
                  <Typography variant="body1">{employeeData.fullName}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Employee ID</Typography>
                  <Typography variant="body1">{employeeData.id}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Department</Typography>
                  <Typography variant="body1">{employeeData.department}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Designation</Typography>
                  <Typography variant="body1">{employeeData.role}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1">{employeeData.email}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Payment Period</Typography>
                  <Typography variant="body1">{salaryData.month} {salaryData.year}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Salary Details Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Earnings</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.earnings.basicSalary)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>House Rent Allowance (HRA)</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.earnings.hra)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Conveyance Allowance</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.earnings.conveyanceAllowance)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Medical Allowance</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.earnings.medicalAllowance)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total Earnings</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(salaryData.earnings.totalEarnings)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Deductions</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Provident Fund</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.deductions.providentFund)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Income Tax</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.deductions.incomeTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Professional Tax</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.deductions.professionalTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Attendance Deduction</TableCell>
                      <TableCell align="right">{formatCurrency(salaryData.deductions.attendanceDeduction)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Total Deductions</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(salaryData.deductions.totalDeductions)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Net Salary Section */}
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="h6">Net Salary</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(salaryData.netSalary)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                This is a computer-generated salary slip and does not require a signature.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
};

export default SalarySlipGenerator; 