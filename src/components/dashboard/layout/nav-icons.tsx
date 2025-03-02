import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import {Stethoscope} from '@phosphor-icons/react/dist/ssr/Stethoscope';
import {FirstAid} from '@phosphor-icons/react/dist/ssr/FirstAid'
import {CalendarDots} from '@phosphor-icons/react/dist/ssr/CalendarDots'
import { ClockUser } from '@phosphor-icons/react/dist/ssr/ClockUser';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'stethoscope': Stethoscope,
  'firstAid': FirstAid,
  'calendar-dots': CalendarDots,
  'clock-user': ClockUser,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
