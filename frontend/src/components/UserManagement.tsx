'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { fetchAllUsers, createUser, updateUser, deleteUser, User } from '@/lib/api';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'publisher' | 'reader'>('reader');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách người dùng' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setRole('reader');
    setIsActive(true);
    setCreateDialog(true);
  };

  const handleSaveCreate = async () => {
    try {
      await createUser({ email, password, displayName, role });
      setMessage({ type: 'success', text: 'Tạo người dùng thành công!' });
      setCreateDialog(false);
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Tạo thất bại' });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEmail(user.email);
    setDisplayName(user.displayName || '');
    setRole(user.role);
    setIsActive(user.isActive);
    setPassword('');
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      const payload: any = { email, displayName, role, isActive };
      if (password) payload.password = password;
      await updateUser(selectedUser.id, payload);
      setMessage({ type: 'success', text: 'Cập nhật người dùng thành công!' });
      setEditDialog(false);
      loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Cập nhật thất bại' });
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      setMessage({ type: 'success', text: 'Xóa người dùng thành công!' });
      setDeleteDialog(false);
      loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Xóa thất bại' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'publisher':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700}>
            Quản lý người dùng ({users.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Tạo người dùng mới
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tên hiển thị</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Vai trò</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{user.email}</Typography>
                </TableCell>
                <TableCell>{user.displayName || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as any}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(user)}
                    sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user)}
                    sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Tạo người dùng mới
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Tên hiển thị"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value as any)} label="Vai trò">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="publisher">Publisher</MenuItem>
                <MenuItem value="reader">Reader</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveCreate} disabled={!email || !password}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chỉnh sửa người dùng
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Mật khẩu mới (để trống nếu không đổi)"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Tên hiển thị"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value as any)} label="Vai trò">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="publisher">Publisher</MenuItem>
                <MenuItem value="reader">Reader</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
              label="Hoạt động"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.email}"? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

