/* eslint-disable react/react-in-jsx-scope */
'use client'
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "@/lib/api";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { toast, ToastContainer } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const availableHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

function CreateSchedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [selectedHours, setSelectedHours] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Para edição
  const [openDialog, setOpenDialog] = useState(false);
  const [editSchedule, setEditSchedule] = useState(null);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("spacialty-user-value"));
    setUser(dados);
    const storedToken = localStorage.getItem("custom-auth-token");
    setToken(storedToken);

    if (dados?._id) {
      fetchSchedules(dados);
    }
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedHours([]);
  };

  const toggleHour = (hour) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const saveSchedule = async () => {
    if (!selectedDate || selectedHours.length === 0) return;

    try {
      if (!token) {
        toast.warning("Token não encontrado, faça login novamente.");
        return;
      }

      await api.post(
        "/schedule/schedule",
        {
          user_id: user?._id,
          org_id: user?.orgao_id?._id,
          specialty_id: user?.specialty_id?._id,
          date: selectedDate.format("YYYY-MM-DD"),
          hours: selectedHours,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Agenda criada com sucesso!");
      setSelectedDate(null);
      setSelectedHours([]);
      fetchSchedules(user);
    } catch (error) {
      console.error("Erro ao salvar agenda:", error);
      toast.error("Erro ao salvar agenda");
    }
  };

  const fetchSchedules = async (dados) => {
    if (!dados?._id) return;

    try {
      const token1 = localStorage.getItem("custom-auth-token");
      if (!token1) {
        toast.warning("Token não encontrado, faça login novamente.");
        return;
      }

      const response = await api.get(`/schedule/schedu/${dados?._id}`, {
        headers: { Authorization: `Bearer ${token1}` },
      });

      setScheduleList(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      toast.error("Erro ao carregar horários");
    }
  };

  const handleEditClick = (schedule) => {
    setEditSchedule(schedule);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (scheduleId: any) => {
    console.log('SQ', scheduleId?._id);
    try {
      const token1 = localStorage.getItem("custom-auth-token");
      await api.delete(`/schedule/schedule/${scheduleId?._id}`, {
        headers: { Authorization: `Bearer ${token1}` },
      });

      toast.success("Agenda excluída com sucesso!");
      fetchSchedules(user);
    } catch (error) {
      console.error("Erro ao excluir agenda:", error);
      toast.error("Erro ao excluir agenda");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditSchedule(null);
  };

  const handleDialogSave = async () => {
    if (!editSchedule) return;

    try {
      const token1 = localStorage.getItem("custom-auth-token");
      await api.put(
        `/schedule/schedule/${editSchedule._id}`,
        {
          date: editSchedule.date,
          hours: editSchedule.hours,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        }
      );

      toast.success("Agenda editada com sucesso!");
      setOpenDialog(false);
      fetchSchedules(user);
    } catch (error) {
      console.error("Erro ao editar agenda:", error);
      toast.error("Erro ao editar agenda");
    }
  };

  const handleHourClick = (hour) => {
    console.log("Horário selecionado:", hour);
    toast.info(`Horário selecionado: ${hour}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Card sx={{ maxWidth: 500, mx: "auto", p: 2, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6">Selecione um dia</Typography>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            disablePast
            renderDay={(day, selectedDays, pickersDayProps) => (
              <PickersDay {...pickersDayProps} />
            )}
          />
          {selectedDate ? <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Selecione os horários
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {availableHours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHours.includes(hour) ? "contained" : "outlined"}
                    onClick={() => { toggleHour(hour); }}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                onClick={saveSchedule}
                disabled={selectedHours.length === 0}
              >
                Salvar Agenda
              </Button>
            </> : null}
        </CardContent>
      </Card>

      {/* Tabela de horários agendados */}
      <TableContainer component={Paper} sx={{ width: "100%", mt: 4, overflowX: "auto" }}>
        <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
          Horários Agendados
        </Typography>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleList.length > 0 ? (
              scheduleList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginação
                .map((schedule) => (
                  <TableRow key={`${schedule.date}-${schedule.hours}`}>
                    <TableCell>{dayjs(schedule.date).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>
                      {schedule.hours.map((hour, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          onClick={() => { handleHourClick(hour); }}
                          sx={{ margin: "2px" }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </TableCell>
                    <TableCell>
                      {/* <IconButton onClick={() => { handleEditClick(schedule); }}>
                        <EditIcon />
                      </IconButton> */}
                      <IconButton onClick={() => handleDeleteClick(schedule)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Sem agendamentos.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={scheduleList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </TableContainer>

      {/* Dialog de edição */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Editar Agenda</DialogTitle>
        <DialogContent>
          <TextField
            label="Data"
            value={editSchedule ? editSchedule.date : ""}
            fullWidth
            disabled
          />
          <TextField
            label="Horários"
            value={editSchedule ? editSchedule.hours.join(", ") : ""}
            fullWidth
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </LocalizationProvider>
  );
}

export default CreateSchedule;
