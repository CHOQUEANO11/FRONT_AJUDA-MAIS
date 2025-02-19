import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { config } from "@/config";
import Appointments from "@/components/dashboard/appointment/get-appointments";

export const metadata = { title: `Appointments | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{ width: "100%", p: 3 }}>
      <Typography variant="h6">Buscar / agendamentos</Typography>
      {/* <Typography variant="h4">Cadastrar / especialidade</Typography> */}

      <Grid container>
        <Grid item xs={12}>
          <Appointments />
        </Grid>
      </Grid>
    </Stack>
  );
}
