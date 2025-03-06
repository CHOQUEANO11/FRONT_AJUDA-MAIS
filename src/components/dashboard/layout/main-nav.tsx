/* eslint-disable @typescript-eslint/no-unsafe-call */


/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import Api from '../../../lib/api'
import { toast, ToastContainer } from 'react-toastify';
import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import io from 'socket.io-client';


const socket = io('https://api-ajuda-mais.onrender.com');
export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [openAppointments, setOpenAppointments] = React.useState(0);
  const [user, setUser] = React.useState<{ _id: string } | null>(null);
  const dados = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');


  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');
    setUser(userData);

    if (userData?._id) {
      fetchAppointments(userData._id);
    }
  }, []);


  React.useEffect(() => {
    socket.on('appointmentUpdated', () => {
      if (user?._id) {
        fetchAppointments(user._id); // Recarrega os agendamentos sempre que um evento chegar
      }
    });

    return () => {
      socket.off('appointmentUpdated'); // Evita múltiplas conexões
    };
  }, [user]);

  const fetchAppointments = async (userId: string) => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await Api.get(`/appointment/appointments/specialist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenAppointments(response.data.filter((appointment: { status: string; }) => appointment.status === "aberta").length);
      // console.log('VALOR', response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
    }
  };// Chamada ao montar o componente
  // console.log('PP', dados?.photo)

  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notificações">
      <Badge
        badgeContent={openAppointments > 0 ? openAppointments : null}
        color="success"
        variant={openAppointments > 0 ? "standard" : "dot"}
      >
        <IconButton>
          <BellIcon />
        </IconButton>
      </Badge>
    </Tooltip>
            <span>Olá Dr. {dados?.name}</span>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={`http://localhost:3333/${dados?.photo}`}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
        <ToastContainer />
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
