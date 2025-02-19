export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    register: '/dashboard/register',
    specialty: '/dashboard/specialty',
    schedule: '/dashboard/schedule',
    appointments: '/dashboard/appointments',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
