"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  name: z.string().min(5, "O nome deve ter mais de 5 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function CreateSpecialty() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [specialties, setSpecialties] = React.useState<FormData[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 5;

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSpecialties((prev) => [...prev, data]);
    reset(); // Limpa o formulário após o envio
    setShowForm(false); // Oculta o formulário após cadastro
  };

  const handleEdit = (index: number) => {
    const specialty = specialties[index];
    reset(specialty); // Preenche o formulário com os dados da especialidade
    setShowForm(true); // Mostra o formulário de edição
  };

  const handleDelete = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
    toast.success("Especialidade excluída com sucesso.");
  };

  React.useEffect(() => {
    if (specialties.length === 0) {
      toast.error("Nenhuma especialidade cadastrada.");
    }
  }, [specialties]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth={false} sx={{ width: "100%", p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4">Especialidades</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, marginBottom: 5 }}>
        <IconButton
          onClick={() => { setShowForm(true); }}
          sx={{ bgcolor: "#03DAC6", "&:hover": { bgcolor: "#02c7" } }}
        >
          <AddIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      {showForm ? <Box sx={{ mt: 3, marginBottom: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Especialidade"
                  {...register("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 1.5,
                    bgcolor: "#03DAC6",
                    height: 58,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#0693e3" },
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box> : null}

      {/* Tabela de Especialidades */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome da Especialidade</strong></TableCell>
              <TableCell style={{float: 'right'}}><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((specialty, index) => (
                <TableRow key={index}>
                  <TableCell>{specialty.name}</TableCell>
                  <TableCell style={{float: 'right'}}>
                    <IconButton onClick={() => { handleEdit(index); }} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(index); }} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(specialties.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Botão de adicionar */}


      {/* Formulário de Cadastro */}


      {/* Toast Container for React Toastify */}
      <ToastContainer />
    </Container>
  );
}
