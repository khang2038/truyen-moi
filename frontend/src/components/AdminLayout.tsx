'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { text: t('admin.dashboard'), icon: DashboardIcon, path: '/admin' },
    { text: t('admin.series'), icon: AutoStoriesIcon, path: '/admin/series' },
    { text: t('admin.createSeries'), icon: AddCircleIcon, path: '/admin/series/new' },
    { text: 'Quản lý chương', icon: MenuBookIcon, path: '/admin/chapters' },
    { text: t('admin.createChapter'), icon: AddCircleIcon, path: '/admin/chapters/new' },
    { text: 'Quản lý thể loại', icon: CategoryIcon, path: '/admin/categories' },
    { text: t('admin.users'), icon: PersonIcon, path: '/admin/users' },
    { text: 'Quản lý quảng cáo', icon: CampaignIcon, path: '/admin/ads' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
        }}
      >
        <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 36 }} />
        <Typography variant="h6" noWrap component="div" fontWeight={700} fontSize="1.3rem">
          {t('admin.title')}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 2 }}>
              <ListItemButton
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit', minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              borderColor: 'error.main',
              color: 'error.main',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'error.dark',
                bgcolor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            {t('common.logout')}
          </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('admin.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
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
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

