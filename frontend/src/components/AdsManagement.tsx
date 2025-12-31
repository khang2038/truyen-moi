'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAdsConfig, updateAdsConfig } from '@/lib/api';

interface AdInsert {
  position: number;
  code: string;
  enabled: boolean;
}

export function AdsManagement() {
  const [adsTxt, setAdsTxt] = useState('');
  const [headerScript, setHeaderScript] = useState('');
  const [adInserts, setAdInserts] = useState<AdInsert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const config = await getAdsConfig();
      if (config) {
        setAdsTxt(config.adsTxt || '');
        setHeaderScript(config.headerScript || '');
        setAdInserts(config.adInserts || []);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải cấu hình quảng cáo' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = {};
      if (tab === 0) {
        payload.adsTxt = adsTxt;
        payload.headerScript = headerScript;
      } else {
        payload.adInserts = adInserts;
      }
      await updateAdsConfig(payload);
      setMessage({ type: 'success', text: 'Lưu cấu hình quảng cáo thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Lưu thất bại' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdInsert = () => {
    setAdInserts([...adInserts, { position: 0, code: '', enabled: true }]);
  };

  const handleRemoveAdInsert = (index: number) => {
    setAdInserts(adInserts.filter((_, i) => i !== index));
  };

  const handleUpdateAdInsert = (index: number, field: keyof AdInsert, value: any) => {
    const updated = [...adInserts];
    updated[index] = { ...updated[index], [field]: value };
    setAdInserts(updated);
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <CampaignIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Quản lý quảng cáo
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="ads.txt" />
          <Tab label="Ad Insert" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              ads.txt Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              File ads.txt giúp xác minh quyền sở hữu tên miền với các nhà quảng cáo. Mỗi dòng một entry.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={adsTxt}
              onChange={(e) => setAdsTxt(e.target.value)}
              placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0&#10;example.com, 123456789, RESELLER"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="h6" fontWeight={600} mb={2} mt={4}>
              Header Script
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Script sẽ được chèn vào thẻ &lt;head&gt; của tất cả các trang. Thường dùng cho Google Analytics, Facebook Pixel, v.v.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={headerScript}
              onChange={(e) => setHeaderScript(e.target.value)}
              placeholder="<script async src='https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'></script>&#10;<script>&#10;  window.dataLayer = window.dataLayer || [];&#10;  function gtag(){dataLayer.push(arguments);}&#10;  gtag('js', new Date());&#10;  gtag('config', 'GA_MEASUREMENT_ID');&#10;</script>"
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu ads.txt & Header Script'}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Ad Insert Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chèn quảng cáo vào giữa các trang chapter. Position: 0 = trước trang đầu, 1 = sau trang đầu, v.v.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAdInsert}
                size="small"
              >
                Thêm Ad
              </Button>
            </Box>

            <Stack spacing={2}>
              {adInserts.map((ad, index) => (
                <Card key={index}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Ad #{index + 1}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={ad.enabled}
                              onChange={(e) =>
                                handleUpdateAdInsert(index, 'enabled', e.target.checked)
                              }
                            />
                          }
                          label="Bật"
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveAdInsert(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Stack spacing={2}>
                      <TextField
                        label="Position"
                        type="number"
                        value={ad.position}
                        onChange={(e) =>
                          handleUpdateAdInsert(index, 'position', Number(e.target.value))
                        }
                        helperText="Vị trí chèn quảng cáo (0 = trước trang đầu, 1 = sau trang đầu, ...)"
                        size="small"
                      />
                      <TextField
                        label="Ad Code (HTML)"
                        multiline
                        rows={6}
                        fullWidth
                        value={ad.code}
                        onChange={(e) => handleUpdateAdInsert(index, 'code', e.target.value)}
                        placeholder="<script>...</script> hoặc <div>...</div>"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {adInserts.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Chưa có quảng cáo nào. Nhấn "Thêm Ad" để thêm.
                  </Typography>
                </Paper>
              )}
            </Stack>

            {adInserts.length > 0 && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? 'Đang lưu...' : 'Lưu Ad Inserts'}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

