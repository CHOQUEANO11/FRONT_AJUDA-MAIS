import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { config } from "@/config";
import Schedule from "@/components/dashboard/schedule/create-schedule";

export const metadata = { title: `Agenda | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{ width: "100%", p: 3 }}>
      <Typography variant="h6">Cadastrar / agenda</Typography>

      <Grid container>
        <Grid item xs={12}>
          <Schedule />
        </Grid>
      </Grid>
    </Stack>
  );
}
