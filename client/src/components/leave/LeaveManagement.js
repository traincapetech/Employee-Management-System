import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Tabs, Tab, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Button, Grid, TextField, InputAdornment
} from '@mui/material';
import { Check, Close, Search, FilterList } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';
import employeeService from '../../services/employeeService';
import ConfirmDialog from '../common/ConfirmDialog';

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

const LeaveManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: null,
    leaveRequest: null,
    status: ''
  });

  // Fetch leave requests and employees when component mounts
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch leave requests
      const leaveData = await leaveService.getHrLeaves(user.sub);
      setLeaveRequests(leaveData || []);
      
      // Fetch employees to get names
      const employeeData = await employeeService.getAllEmployees();
      setEmployees(employeeData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load leave management data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleApproveLeave = (leaveRequest) => {
    setConfirmDialog({
      open: true,
      title: 'Approve Leave Request',
      content: `Are you sure you want to approve this leave request from ${getEmployeeName(leaveRequest.employeeId)}?`,
      action: () => updateLeaveStatus(leaveRequest.id, 'APPROVED'),
      leaveRequest,
      status: 'APPROVED'
    });
  };

  const handleRejectLeave = (leaveRequest) => {
    setConfirmDialog({
      open: true,
      title: 'Reject Leave Request',
      content: `Are you sure you want to reject this leave request from ${getEmployeeName(leaveRequest.employeeId)}?`,
      action: () => updateLeaveStatus(leaveRequest.id, 'REJECTED'),
      leaveRequest,
      status: 'REJECTED'
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action();
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      // Update leave status
      await leaveService.updateLeaveStatus(leaveId, status);
      
      // Update local state
      setLeaveRequests(
        leaveRequests.map(leave => 
          leave.id === leaveId 
            ? { ...leave, status } 
            : leave
        )
      );
      
      toast.success(`Leave request ${status.toLowerCase()} successfully`);
      
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing leave request:`, error);
      toast.error(`Failed to ${status.toLowerCase()} leave request`);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.fullName : 'Unknown Employee';
  };

  // Filter leave requests
  const pendingLeaves = leaveRequests.filter(leave => leave.status === 'PENDING');
  const approvedLeaves = leaveRequests.filter(leave => leave.status === 'APPROVED');
  const rejectedLeaves = leaveRequests.filter(leave => leave.status === 'REJECTED' || leave.status === 'AUTO_REJECTED');

  // Apply search filter across all tabs
  const filterLeaves = (leaves) => {
    if (!searchTerm) return leaves;
    
    return leaves.filter(leave => {
      const employeeName = getEmployeeName(leave.employeeId).toLowerCase();
      const reason = leave.reason.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return employeeName.includes(search) || reason.includes(search);
    });
  };

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
        Leave Management
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by employee name or reason..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            <Button 
              startIcon={<FilterList />}
              onClick={fetchData} 
              variant="outlined"
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave management tabs">
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
              {renderLeaveTable(filterLeaves(leaveRequests))}
            </TabPanel>
            
            {/* Pending Leaves */}
            <TabPanel value={tabValue} index={1}>
              {renderLeaveTable(filterLeaves(pendingLeaves))}
            </TabPanel>
            
            {/* Approved Leaves */}
            <TabPanel value={tabValue} index={2}>
              {renderLeaveTable(filterLeaves(approvedLeaves))}
            </TabPanel>
            
            {/* Rejected Leaves */}
            <TabPanel value={tabValue} index={3}>
              {renderLeaveTable(filterLeaves(rejectedLeaves))}
            </TabPanel>
          </>
        )}
      </Paper>
      
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        content={confirmDialog.content}
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
              <TableCell>Employee</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Days</TableCell>
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
                    {getEmployeeName(leave.employeeId)}
                  </TableCell>
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
                    {durationDays}
                  </TableCell>
                  <TableCell>
                    {leave.reason.length > 30 ? `${leave.reason.substring(0, 30)}...` : leave.reason}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(leave.status)}
                  </TableCell>
                  <TableCell>
                    {leave.status === 'PENDING' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleApproveLeave(leave)}
                          title="Approve"
                        >
                          <Check fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRejectLeave(leave)}
                          title="Reject"
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </>
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

export default LeaveManagement; 