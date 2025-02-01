import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { config } from "@/config";
import RegisterProfessional from "@/components/dashboard/register/register";

export const metadata = { title: `Register | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{ width: "100%", p: 3 }}>
      <Typography variant="h6">Cadastrar / profissional</Typography>

      <Grid container>
        <Grid item xs={12}>
          <RegisterProfessional />
        </Grid>
      </Grid>
    </Stack>
  );
}
