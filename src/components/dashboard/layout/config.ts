/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// Função para obter o usuário do localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('spacialty-user-value');
  return user ? JSON.parse(user) : null;
};

// Função para gerar os itens de navegação com base no papel do usuário
export const generateNavItems = (): NavItemConfig[] => {
  const user = getUserFromLocalStorage();
  const userRole = user?.role;

  const items: NavItemConfig[] = [

    // Itens condicionais com base no papel do usuário
    ...(userRole === 'master' ? [
      { key: 'register', title: 'Cadastrar Profissional', href: paths.dashboard.register, icon: 'firstAid' },
      { key: 'specialty', title: 'Cadastrar Especialidade', href: paths.dashboard.specialty, icon: 'stethoscope' },
    ] : []),
    // Item sempre visível
    { key: 'schedule', title: 'Cadastrar Agenda', href: paths.dashboard.schedule, icon: 'calendar-dots' },
    { key: 'appointment', title: 'Buscar agendamentos', href: paths.dashboard.appointments, icon: 'stethoscope' },
  ];

  return items;
};
