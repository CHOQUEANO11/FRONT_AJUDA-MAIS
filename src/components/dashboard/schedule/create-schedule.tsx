/* eslint-disable react/react-in-jsx-scope */
'use client'
import { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { LocalizationProvider, DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from '@/lib/api'
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const availableHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

function CreateSchedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const specialistId = "12345"; // Substituir pelo ID real do especialista



  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedHours([]); // Reset ao mudar a data
  };

  const toggleHour = (hour) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const saveSchedule = async () => {
    if (!selectedDate || selectedHours.length === 0) return;

    const response = await api.post("/schedule/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        specialistId,
        date: selectedDate.format("YYYY-MM-DD"),
        hours: selectedHours,
      }),
    });
    console.log('SCHEDULE', {date: selectedDate.format("YYYY-MM-DD"), hours: selectedHours}),
      //     hours: selectedHours,})

    // if (response.ok) {
      alert("Agenda salva com sucesso!");
      setSelectedDate(null);
      setSelectedHours([]);
    // } else {
    //   alert("Erro ao salvar agenda");
    // }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Card sx={{ maxWidth: 400, mx: "auto", p: 2, textAlign: "center" }}>
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
              <Typography variant="h6" sx={{ mt: 2 }}>Selecione os horários</Typography>
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
    </LocalizationProvider>
  );
}

export default CreateSchedule;
