import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Box, Toolbar, IconButton, Typography, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, 
  Container, Menu, MenuItem, Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  People, 
  CalendarToday, 
  AssignmentTurnedIn, 
  AccountCircle,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const MainLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const { user, logout, getUserRole } = useAuth();
  const userRole = getUserRole();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  // Define menu items based on role
  const getMenuItems = () => {
    const menuItems = [
      { 
        text: 'Dashboard', 
        icon: <Dashboard />, 
        path: `/${userRole?.toLowerCase()}/dashboard`
      }
    ];

    if (userRole === 'ADMIN' || userRole === 'HR') {
      menuItems.push(
        { 
          text: 'Employees', 
          icon: <People />, 
          path: '/employees'
        },
        {
          text: 'Attendance', 
          icon: <AssignmentTurnedIn />, 
          path: '/attendance'
        },
        {
          text: 'Leave Requests', 
          icon: <CalendarToday />, 
          path: '/leave-requests'
        },
        {
          text: 'Salary Slips', 
          icon: <Receipt />, 
          path: '/salary-slips'
        }
      );
    }

    if (userRole === 'EMPLOYEE') {
      menuItems.push(
        {
          text: 'My Attendance', 
          icon: <AssignmentTurnedIn />, 
          path: '/my-attendance'
        },
        {
          text: 'Leave Requests', 
          icon: <CalendarToday />, 
          path: '/my-leaves'
        },
        {
          text: 'Salary Slips', 
          icon: <Receipt />, 
          path: '/my-salary-slips'
        }
      );
    }

    return menuItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          EMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title || 'Employee Management System'}
          </Typography>
          {user && (
            <div>
              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px' 
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 