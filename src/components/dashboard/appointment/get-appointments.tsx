/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable react/hook-use-state */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useEffect, useState } from 'react';
import {
  // TablePagination,
  // IconButton,
  // Collapse,
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';

import api from '@/lib/api';

// import DeleteIcon from "@mui/icons-material/Delete";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Appointment {
  _id: string;
  date: string;
  hour: string;
  status: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  specialist_id: {
    _id: string;
    name: string;
    email: string;
    specialty_id: {
      _id: string;
      name: string;
    };
  };
  specialty_id: {
    _id: string;
    name: string;
  };
}

interface MedicalRecord {
  _id: string;
  notes: string;
  createdAt: string;
}

interface Emotion {
  _id: string;
  user_id: string;
  name: string;
  identificador: string;
  description: string;
  created_at: Date;
}

function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page] = useState(0);
  const [rowsPerPage] = useState(5);
  const [user, setUser] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [newRecord, setNewRecord] = useState('');
  const [openEmotionModal, setOpenEmotionModal] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');
    setUser(userData);

    if (userData?._id) {
      fetchAppointments(userData._id);
    }
  }, []);

  const fetchAppointments = async (userId: string) => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await api.get(`/appointment/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
    }
  };

  const fetchMedicalRecords = async (userId: string) => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await api.get(`/medicalRecord/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicalRecords(response.data);
    } catch (error) {
      toast.error('Erro ao carregar prontuários');
    }
  };

  const handleOpenProntuario = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setMedicalRecords([]);
    setNewRecord('');
    fetchMedicalRecords(appointment.user_id._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setMedicalRecords([]);
  };

  const handleSaveMedicalRecord = async () => {
    if (!newRecord.trim()) {
      toast.warning('A observação não pode estar vazia.');
      return;
    }

    try {
      const token = localStorage.getItem('custom-auth-token');
      await api.post(
        `/medicalRecord`,
        {
          user_id: selectedAppointment?.user_id._id,
          specialist_id: selectedAppointment?.specialist_id._id,
          appointment_id: selectedAppointment?._id,
          date: selectedAppointment?.date, // Adicionando a data
          notes: newRecord,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await api.put(
        `/appointment/appointments/${selectedAppointment?._id}/status`,
        { status: 'realizada' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await api.put(
        `usuario/user/${selectedAppointment?.user_id._id}`,
        { emotion: 'visible' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Prontuário salvo com sucesso!');
      fetchMedicalRecords(selectedAppointment!.user_id._id);
      setNewRecord('');

      handleClose();

      // Atualiza a lista de agendamentos sem recarregar a página
      fetchAppointments(user._id);
    } catch (error) {
      toast.error('Erro ao salvar o prontuário.');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('custom-auth-token');

      await api.put(
        `/appointment/appointments/${appointmentId}/status`,
        { status: 'cancelada' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Agendamento marcado como cancelado.');

      // Atualiza a lista de agendamentos sem recarregar a página
      fetchAppointments(user._id);
      handleClose();
    } catch (error) {
      toast.error('Erro ao atualizar o status do agendamento.');
    }
  };

  const handleOpenEmotionModal = async () => {
    if (selectedAppointment) {
      try {
        const token = localStorage.getItem('custom-auth-token');
        const response = await api.get(`/emotionUser/emotionsUser/${selectedAppointment.user_id._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmotions(response.data);
        setOpenEmotionModal(true);
        // console.log('CC', response.data);
      } catch (error) {
        toast.error('Erro ao buscar diário de emoções.');
      }
    }
  };

  const handleCloseEmotionModal = () => {
    setOpenEmotionModal(false);
  };

  const calculateEmotionStats = () => {
    if (!emotions || emotions.length === 0) {
      return { mostFrequentEmotion: null, percentage: null, description: null };
    }

    const emotionCount = emotions.reduce(
      (acc, emotion) => {
        if (!emotion?.name || !emotion.description) return acc;

        if (!acc[emotion.name]) {
          acc[emotion.name] = { count: 0, description: emotion.description };
        }

        acc[emotion.name].count += 1;
        return acc;
      },
      {} as Record<string, { count: number; description: string }>
    );

    if (Object.keys(emotionCount).length === 0) {
      return { mostFrequentEmotion: null, percentage: null, description: null };
    }

    const mostFrequentEmotion = Object.keys(emotionCount).reduce((a, b) =>
      emotionCount[a].count > emotionCount[b].count ? a : b
    );

    const totalEmotions = emotions.length;
    const percentage = ((emotionCount[mostFrequentEmotion].count / totalEmotions) * 100).toFixed(2);
    const description = emotionCount[mostFrequentEmotion].description;

    return { mostFrequentEmotion, percentage, description };
  };

  // Chama a função corretamente
  const { mostFrequentEmotion, percentage, description } = calculateEmotionStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <TableContainer component={Paper} sx={{ width: '100%', mt: 4, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Nome do Paciente</TableCell>
              <TableCell>Especialista</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments
                .sort((a, b) => dayjs(a.hour, 'HH:mm').toDate().getTime() - dayjs(b.hour, 'HH:mm').toDate().getTime())
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{dayjs(appointment.date).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{appointment.hour}</TableCell>
                    <TableCell>{appointment.user_id.name?.toUpperCase()}</TableCell>
                    <TableCell>{appointment.specialist_id.name?.toUpperCase()}</TableCell>
                    <TableCell>{appointment?.specialty_id?.name || 'Especialidade não informada'}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          appointment.status === 'aberta'
                            ? 'green'
                            : appointment.status === 'realizada'
                              ? 'blue'
                              : 'red',
                        fontWeight: 'bold',
                        borderWidth: 7,
                        borderColor:
                          appointment.status === 'aberta'
                            ? 'green'
                            : appointment.status === 'realizada'
                              ? 'blue'
                              : 'red',
                        width: 50,
                      }}
                    >
                      {appointment.status === 'aberta'
                        ? 'Aberta'
                        : appointment.status === 'realizada'
                          ? 'Realizada'
                          : 'Cancelada'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => handleOpenProntuario(appointment)}>
                        Prontuário
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>Sem agendamentos.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 3,
            backgroundColor: 'white',
            width: '80%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10, // Garante que fique acima do conteúdo
              backgroundColor: 'white', // Evita sobreposição visual
              '@media (max-width: 600px)': {
                position: 'fixed', // Torna fixo na tela
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)', // Centraliza horizontalmente
                width: '100%', // Ajusta o tamanho em telas pequenas
                textAlign: 'center',
              },
            }}
            onClick={handleOpenEmotionModal}
          >
            Ver Diário de Emoções
          </Button>

          <Typography align="center" style={{ textAlign: 'center' }} variant="h5">
            Prontuário do Paciente
          </Typography>
          {selectedAppointment && (
            <>
              <Typography>
                <strong>Nome:</strong> {selectedAppointment.user_id.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedAppointment.user_id.email}
              </Typography>
              <Typography>
                <strong>Telefone:</strong> {selectedAppointment.user_id.phone}
              </Typography>
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              <strong>Histórico de Prontuários:</strong>
            </Typography>
            {medicalRecords.length > 0 ? (
              medicalRecords.map((record) => (
                <Box key={record._id} sx={{ p: 1, backgroundColor: '#f9f9f9', borderRadius: 1, mb: 1 }}>
                  <Typography>{record.notes}</Typography>
                  <Typography variant="caption">{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
                </Box>
              ))
            ) : (
              <Typography>Nenhum prontuário encontrado.</Typography>
            )}
          </Box>

          <TextField
            label="Nova Observação"
            fullWidth
            multiline
            rows={3}
            value={newRecord}
            onChange={(e) => setNewRecord(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mt: 2,
              '@media (max-width: 600px)': {
                flexDirection: 'column', // No celular, os botões ficam um abaixo do outro
                alignItems: 'center',
              },
            }}
          >
            <Button variant="contained" onClick={handleSaveMedicalRecord}>
              Salvar
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', color: 'white' }}
              onClick={() => selectedAppointment?._id && handleCancelAppointment(selectedAppointment._id)}
            >
              Paciente não compareceu
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openEmotionModal} onClose={handleCloseEmotionModal}>
  <>
    <Box
      sx={{
        p: 3,
        backgroundColor: 'white',
        width: '60%', // Ajuste da largura para ser mais responsivo
        maxWidth: 600, // Limite máximo da largura
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
        maxHeight: '55vh', // Definindo a altura máxima para que o conteúdo não ultrapasse a tela
        overflowY: 'auto', // Permite rolagem se o conteúdo for maior que a altura do modal
      }}
    >
      <Typography align="center" variant="h5">
        Diário de Emoções
      </Typography>
      <Box sx={{ mt: 2 }}>
        {emotions.length > 0 ? (
          emotions.map((emotion) => (
            <Box key={emotion._id} sx={{ p: 1, backgroundColor: '#f9f9f9', borderRadius: 1, mb: 1 }}>
              <Typography>{emotion.name}</Typography>
              <Typography>{emotion.description}</Typography>
              <Typography variant="caption">{dayjs(emotion.created_at).format('DD/MM/YYYY HH:mm')}</Typography>
            </Box>
          ))
        ) : (
          <Typography>Nenhuma emoção registrada.</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleCloseEmotionModal}>
          Fechar
        </Button>
      </Box>
    </Box>

    {mostFrequentEmotion && percentage && description && (
      <Box sx={{ mt: 2, p: 2, backgroundColor: '#eef2ff', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h6">Análise Emocional</Typography>
        <Typography>
          A emoção mais frequente foi <strong>{mostFrequentEmotion}</strong>, aparecendo em{' '}
          <strong>{percentage}%</strong> dos registros.
        </Typography>
        <Typography sx={{ mt: 1 }}>{description}</Typography>
      </Box>
    )}
  </>
</Modal>

      <ToastContainer />
    </LocalizationProvider>
  );
}

export default Appointments;
