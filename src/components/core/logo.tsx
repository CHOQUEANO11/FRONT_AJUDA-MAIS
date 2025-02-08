'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 80;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, width = WIDTH }: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    url = color === 'light' ? '/assets/logo2.png' : '/assets/logo2.png';
  } else {
    url = color === 'light' ? '/assets/logo2.png' : '/assets/logo2.png';
  }

  return <Box
  alt="logo"
  component="img"
  height={80}
  src={url}
  width={width}
  sx={{
    display: "flex",
    justifyContent: "center", // Centraliza horizontalmente
    alignItems: "center", // Opcional: centraliza verticalmente se necessário
    margin: "0 auto", // Outra forma de garantir a centralização horizontal
  }}
/>
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
