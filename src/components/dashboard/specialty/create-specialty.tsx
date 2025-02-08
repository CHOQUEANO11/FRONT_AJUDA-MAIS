/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import api from '@/lib/api';
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  name: z.string().min(5, "O nome deve ter mais de 5 caracteres"),
});

type FormData = z.infer<typeof schema>;

interface Specialty {
  _id: string; // ou o tipo apropriado para o _id, por exemplo, ObjectId
  name: string;
  orgao_id?: { _id: string }; // Caso orgao_id seja um objeto com um _id
}


export default function CreateSpecialty() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [editingSpecialty, setEditingSpecialty] = React.useState<Specialty | null>(null);
  const itemsPerPage = 5;

  React.useEffect(() => {
    getSpecialty();
  }, []);

  const getSpecialty = async () => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const dados = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');

      if (!dados?.orgao_id?._id) {
        toast.error("ID do órgão não encontrado.");
        return;
      }

      const response = await api.get(`specialty/specialty/${dados.orgao_id._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSpecialties(response.data.specialties);
      console.log('bb', response.data)
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      toast.error("Erro ao carregar especialidades");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const dados = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');

      if (editingSpecialty) {
        // Editando uma especialidade existente
        const response = await api.put(`/specialty/specialty/${editingSpecialty._id}`, {
          name: data.name,
          orgao_id: dados?.orgao_id?._id,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Especialidade atualizada com sucesso!");
      } else {
        // Criando uma nova especialidade
        const response = await api.post("/specialty/specialty", {
          name: data.name,
          orgao_id: dados?.orgao_id?._id,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Especialidade cadastrada com sucesso!");
      }

      setShowForm(false);
      setEditingSpecialty(null);
      reset();
      getSpecialty();
    } catch (error) {
      console.error("Erro ao cadastrar/editar especialidade:", error);
      toast.error("Erro ao cadastrar/editar especialidade");
    }
  };

  const handleEdit = (specialty: any) => {
    setEditingSpecialty(specialty);
    setShowForm(true);
    reset({ name: specialty.name });
  };

  const handleDelete = async (specialty: any) => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const dados = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');

      await api.delete(`/specialty/specialty/${specialty?._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Especialidade excluída com sucesso!");
      getSpecialty();
    } catch (error) {
      console.error("Erro ao excluir especialidade:", error);
      toast.error("Erro ao excluir especialidade");
    }
  };

  return (
    <Container maxWidth={false} sx={{ width: "100%", p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4">Especialidades</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, marginBottom: 5 }}>
        <IconButton
          onClick={() => { setShowForm(true); setEditingSpecialty(null); }}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome da Especialidade</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.length > 0 ? (
              specialties
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((specialty, index) => (
                  <TableRow key={index}>
                    <TableCell>{specialty?.name}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => { handleEdit(specialty); }}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(specialty)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">Nenhuma especialidade encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil((specialties?.length || 1) / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => { setCurrentPage(value); }}
          color="primary"
        />
      </Box>
      <ToastContainer />
    </Container>
  );
}
