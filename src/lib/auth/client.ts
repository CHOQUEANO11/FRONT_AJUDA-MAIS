/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
'use client';

import axios from 'axios';
import type { User } from '@/types/user';
import api from '@/lib/api'

const API_BASE_URL = 'http://localhost:3001'; // Altere para sua API

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_BASE_URL}/signup`, params);
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar' };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const response = await api.post(`/login/specialty`, params);
      const { token, user } = response.data;

      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem('spacialty-user-value', JSON.stringify(user));
      // console.log('USER', user)
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Erro ao fazer login' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token'); // Pegue o token do localStorage

    // Se não tiver o token, retorne null
    if (!token) {
      return { data: null };
    }

    try {
      // Faça uma requisição para buscar os dados do usuário usando o token
      const response = await api.get('/specialtyUser/getUser', {
        headers: {
          Authorization: `Bearer ${token}`, // Envie o token no cabeçalho da requisição
        },
      });

      // Se a resposta contiver os dados do usuário, retorne-os
      if (response.data) {
        return { data: response.data as User }; // Converta a resposta para o tipo 'User'
      }
        return { data: null }; // Se não encontrar o usuário, retorne null

    } catch (error) {
      // Caso ocorra um erro, retorne a mensagem de erro
      return { error: 'Erro ao buscar os dados do usuário' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();



// 'use client';

// import type { User } from '@/types/user';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/nilson.jpg',
//   firstName: 'Nilson',
//   lastName: 'Silva',
//   email: 'nilson@gmail.com',
// } satisfies User;

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface SignInWithOAuthParams {
//   provider: 'google' | 'discord';
// }

// export interface SignInWithPasswordParams {
//   email: string;
//   password: string;
// }

// export interface ResetPasswordParams {
//   email: string;
// }

// class AuthClient {
//   async signUp(_: SignUpParams): Promise<{ error?: string }> {
//     // Make API request

//     // We do not handle the API, so we'll just generate a token and store it in localStorage.
//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);

//     return {};
//   }

//   async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
//     return { error: 'Social authentication not implemented' };
//   }

//   async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
//     const { email, password } = params;

//     // Make API request

//     // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
//     if (email !== 'nilson@gmail.com' || password !== 'Secret1') {
//       return { error: 'Invalid credentials' };
//     }

//     const token = generateToken();
//     localStorage.setItem('custom-auth-token', token);

//     return {};
//   }

//   async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Password reset not implemented' };
//   }

//   async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
//     return { error: 'Update reset not implemented' };
//   }

//   async getUser(): Promise<{ data?: User | null; error?: string }> {
//     // Make API request

//     // We do not handle the API, so just check if we have a token in localStorage.
//     const token = localStorage.getItem('custom-auth-token');

//     if (!token) {
//       return { data: null };
//     }

//     return { data: user };
//   }

//   async signOut(): Promise<{ error?: string }> {
//     localStorage.removeItem('custom-auth-token');

//     return {};
//   }
// }

// export const authClient = new AuthClient();
