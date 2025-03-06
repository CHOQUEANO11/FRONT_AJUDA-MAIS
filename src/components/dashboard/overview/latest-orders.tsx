/* eslint-disable import/no-named-as-default-member */


/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import * as React from 'react';
'use client'
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { toast } from 'react-toastify';
import api from '@/lib/api'

dayjs.locale('pt-br');

const statusMap = {
  aberta: { label: 'Aberta', color: 'success' },
  realizada: { label: 'Realizada', color: 'primary' },
  cancelada: { label: 'Cancelada', color: 'error' },
} as const;

export interface Appointment {
  _id: string;
  createdAt: string;
  date: string;
  hour: string;
  orgao_id: { name: string };
  specialist_id: { name: string; email: string; phone: string };
  specialty_id: { name: string };
  status: 'aberta' | 'realizada' | 'cancelada';
  user_id: { name: string; email: string; phone: string };
}

export interface LatestAppointmentsProps {
  appointments?: Appointment[];
  sx?: SxProps;
}

export interface Order {
  id: string;
  customer: { name: string };
  amount: number;
  status: 'pendente' | 'realizado' | 'cancelado';
  createdAt: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ orders = [], sx }: LatestOrdersProps): React.JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<{ _id: string } | null>(null);

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
      const response = await api.get(`/appointment/appointments/specialist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
    }
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Meus Atendimentos" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nº</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Órgão</TableCell>
              <TableCell>Especialista</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => {
              const { label, color } = statusMap[appointment.status] ?? { label: 'Desconhecido', color: 'default' };

              return (
                <TableRow hover key={appointment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{appointment.user_id.name}</TableCell>
                  <TableCell>{appointment.orgao_id.name}</TableCell>
                  <TableCell>{appointment.specialist_id.name}</TableCell>
                  <TableCell>{appointment.specialty_id.name}</TableCell>
                  <TableCell>{dayjs(appointment.date).format('DD [de] MMMM [de] YYYY')}</TableCell>
                  <TableCell>{appointment.hour}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
