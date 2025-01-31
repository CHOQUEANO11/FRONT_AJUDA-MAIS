/* eslint-disable no-console -- Allow */
import { useEffect, useState } from 'react';

export interface UserProfile {
  role: string;
};

export function useUserProfile(): string | null {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = localStorage.getItem('userProfile');

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile) as UserProfile; // Forçando o tipo

          if (parsedProfile && typeof parsedProfile.role === 'string') {
            setRole(parsedProfile.role);
          } else {
            console.warn('Perfil do usuário inválido no localStorage');
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar o perfil do usuário:', error);
      }
    }
  }, []);

  return role;
}
