/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import api from '@/lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { toast } from 'react-toastify';

dayjs.locale('pt-br');

const socket = io('https://api-ajuda-mais.onrender.com');

interface SalesProps {
  chartSeries?: { name: string; data: number[] }[];
  sx?: SxProps;
}

export function Sales({ chartSeries = [], sx }: SalesProps): React.JSX.Element {
  const [localChartSeries, setLocalChartSeries] = useState<{ name: string; data: number[] }[]>([
    { name: 'Atendimentos', data: Array(12).fill(0) }
  ]);

  const theme = useTheme();

  useEffect(() => {
    fetchAppointments();
    socket.on('appointmentUpdated', fetchAppointments);

    return () => {
      socket.off('appointmentUpdated', fetchAppointments);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await api.get('/appointment/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      processAppointments(response.data);
    } catch (error) {
      toast.error('Erro ao carregar atendimentos');
    }
  };

  const processAppointments = (appointments: any[]) => {
    const monthlyCounts = Array(12).fill(0);
    appointments.forEach((appointment) => {
      const month = dayjs(appointment.date).month();
      monthlyCounts[month] += 1;
    });
    setLocalChartSeries([{ name: 'Atendimentos', data: monthlyCounts }]);
  };

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />} onClick={fetchAppointments}>
            Atualizar
          </Button>
        }
        title="Total de Atendimentos"
      />
      <CardContent>
        <Chart height={350} options={useChartOptions(theme)} series={localChartSeries} type="bar" width="100%" />
      </CardContent>
    </Card>
  );
}

function useChartOptions(theme: any): ApexOptions {
  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value) => Math.floor(value).toString(),
        offsetX: -2,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
