import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  SupervisorAccount,
  FamilyRestroom,
  Class,
  Subject,
  EventNote,
  Assignment,
  Assessment,
  CloudUpload,
  AdminPanelSettings,
  ChevronLeft,
  AccountCircle,
  Logout,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { getInitials } from '../../utils/helpers';

const DRAWER_WIDTH = 240;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: NavItem[];
}

const allNavItems: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: <Dashboard />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { title: 'Users', path: '/users', icon: <People />, roles: ['admin'] },
  { title: 'Roles', path: '/roles', icon: <AdminPanelSettings />, roles: ['admin'] },
  { title: 'Students', path: '/students', icon: <School />, roles: ['admin', 'teacher'] },
  { title: 'Teachers', path: '/teachers', icon: <SupervisorAccount />, roles: ['admin'] },
  { title: 'Parents', path: '/parents', icon: <FamilyRestroom />, roles: ['admin'] },
  { title: 'Classes', path: '/classes', icon: <Class />, roles: ['admin', 'teacher'] },
  { title: 'Subjects', path: '/subjects', icon: <Subject />, roles: ['admin', 'teacher'] },
  { title: 'Attendance', path: '/attendance', icon: <EventNote />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { title: 'Exams', path: '/exams', icon: <Assignment />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { title: 'Results', path: '/results', icon: <Assessment />, roles: ['admin', 'teacher', 'student', 'parent'] },
  { title: 'Files', path: '/files', icon: <CloudUpload />, roles: ['admin', 'teacher'] },
];

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { roleName } = usePermissions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = allNavItems.filter(
    (item) => !item.roles || (roleName && item.roles.includes(roleName))
  );

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School sx={{ color: 'primary.main' }} />
          {open && (
            <Typography variant="h6" fontWeight="bold" color="primary">
              LMS
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.title);
                  } else {
                    navigate(item.path);
                    if (isMobile) setOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <Tooltip title={!open ? item.title : ''} placement="right">
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                </Tooltip>
                {open && <ListItemText primary={item.title} />}
                {open && item.children && (
                  expandedItems.includes(item.title) ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={expandedItems.includes(item.title)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.path} disablePadding>
                      <ListItemButton
                        selected={isActive(child.path)}
                        onClick={() => {
                          navigate(child.path);
                          if (isMobile) setOpen(false);
                        }}
                        sx={{ pl: 4, borderRadius: 1, mx: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Learning Management System
          </Typography>
          <Tooltip title="Account">
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
                {user?.name ? getInitials(user.name) : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" fontWeight="bold">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              <Typography variant="caption" display="block" color="primary">
                {user?.role?.name}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : 72,
            flexShrink: 0,
            transition: 'width 0.2s',
            '& .MuiDrawer-paper': {
              width: open ? DRAWER_WIDTH : 72,
              boxSizing: 'border-box',
              transition: 'width 0.2s',
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
