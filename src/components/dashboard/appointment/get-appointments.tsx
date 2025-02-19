/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "@/lib/api";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Tipo de dados de Appointment
interface Appointment {
  _id: string;
  date: string;
  hour: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  specialty_id: {
    _id: string;
    name: string;
  };
  specialist_id: {
    _id: string;
    name: string;
    email: string;
  };
  orgao_id: {
    _id: string;
    name: string;
  };
}

interface EmotionDiary {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  identificador: string;
}

function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [user, setUser] = useState<any | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [emotionDiaries, setEmotionDiaries] = useState<EmotionDiary[]>([]);
  const [emotionPage, setEmotionPage] = useState(0);
  const [emotionRowsPerPage, setEmotionRowsPerPage] = useState(5);
  const [emotionPercentage, setEmotionPercentage] = useState<number>(0);
  const [mostFrequentEmotion, setMostFrequentEmotion] = useState<string>("");

  useEffect(() => {
    const dados: any = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');
    setUser(dados);

    if (dados?._id) {
      fetchAppointments(dados._id);
    }
  }, []);

  const fetchAppointments = async (userId: string) => {
    try {
      const token = localStorage.getItem("custom-auth-token");
      if (!token) {
        toast.warning("Token não encontrado, faça login novamente.");
        return;
      }

      const response = await api.get(`/appointment/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length === 0) {
        toast.info("Nenhum agendamento registrado.");
      }

      setAppointments(response.data);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos");
    }
  };

  const handleDeleteClick = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem("custom-auth-token");
      await api.delete(`/appointment/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Agendamento excluído com sucesso!");
      fetchAppointments(user._id);
    } catch (error) {
      toast.error("Erro ao excluir agendamento");
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmotionChangePage = (event: any, newPage: any) => {
    setEmotionPage(newPage);
  };

  const handleEmotionChangeRowsPerPage = (event: any) => {
    setEmotionRowsPerPage(parseInt(event.target.value, 10));
    setEmotionPage(0);
  };

  const handleExpandClick = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null); // Se já estiver expandido, fecha
    } else {
      setExpandedUserId(userId); // Se não, abre o diário de emoções
      try {
        const token = localStorage.getItem("custom-auth-token");
        const response = await api.get(`/emotionUser/emotionsUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmotionDiaries(response.data); // Agora estamos recebendo um array de emoções

        // Calcular a porcentagem da emoção mais frequente
        if (response.data.length > 0) {
          const emotionCount: { [key: string]: number } = {};
          response.data.forEach((emotion: any) => {
            emotionCount[emotion.name] = (emotionCount[emotion.name] || 0) + 1;
          });

          // Encontrar a emoção mais frequente
          const maxEmotion = Object.entries(emotionCount).reduce(
            (max, [name, count]) => (count > max.count ? { name, count } : max),
            { name: "", count: 0 }
          );

          const totalEmotions = response.data.length;
          const percentage = ((maxEmotion.count / totalEmotions) * 100).toFixed(2);

          setMostFrequentEmotion(maxEmotion.name);
          setEmotionPercentage(Number(percentage));
        }
      } catch (error) {
        toast.error("Erro ao carregar o diário de emoções");
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <TableContainer component={Paper} sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Nome do Paciente</TableCell>
              <TableCell>Email do Paciente</TableCell>
              <TableCell>Telefone do Paciente</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{dayjs(appointment.date).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{appointment.hour}</TableCell>
                    <TableCell>{appointment.user_id.name}</TableCell>
                    <TableCell>{appointment.user_id.email}</TableCell>
                    <TableCell>{appointment.user_id.phone}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteClick(appointment._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                      <IconButton onClick={() => handleExpandClick(appointment.user_id._id)}>
                        {expandedUserId === appointment.user_id._id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>Sem agendamentos.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </TableContainer>

      <ToastContainer />

      {/* Exibição do diário de emoções */}
      <Collapse in={expandedUserId !== null}>
        <Box sx={{ padding: 2, mt: 2 }}>
          {emotionDiaries.length > 0 ? (
            <>
              <Typography variant="h6">Diário de Emoções</Typography>
              <Typography variant="subtitle1">
                Emoção mais frequente: <strong>{mostFrequentEmotion}</strong> com {emotionPercentage}% das emoções.
              </Typography>
              {emotionDiaries
                .slice(emotionPage * emotionRowsPerPage, emotionPage * emotionRowsPerPage + emotionRowsPerPage)
                .map((emotion) => (
                  <Box key={emotion.id} sx={{ mb: 2 }}>
                    <Typography><strong>Nome:</strong> {emotion.name}</Typography>
                    <Typography><strong>Identificador:</strong> {emotion?.identificador}</Typography>
                    <Typography><strong>Data de Criação:</strong> {dayjs(emotion.created_at).format("DD/MM/YYYY")}</Typography>
                  </Box>
                ))}
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={emotionDiaries.length}
                rowsPerPage={emotionRowsPerPage}
                page={emotionPage}
                onPageChange={handleEmotionChangePage}
                onRowsPerPageChange={handleEmotionChangeRowsPerPage}
                labelRowsPerPage="Linhas por página"
              />
            </>
          ) : (
            <Typography>Não há emoções registradas para este usuário.</Typography>
          )}
        </Box>
      </Collapse>
    </LocalizationProvider>
  );
}

export default Appointments;





