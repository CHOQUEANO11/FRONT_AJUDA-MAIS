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
  MenuItem,
  Grid,
  Container,
  CircularProgress,
  IconButton as MuiIconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const schema = z.object({
  fullName: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  organization: z.coerce.number().min(1, { message: "Informe um órgão válido" }),
  specialty: z.coerce.number().min(1, { message: "Informe uma especialidade" }),
  password: z.string().default("123456"),
});

type FormData = z.infer<typeof schema>;

const specialties = [
  { id: 1, name: "Psicólogo" },
  { id: 2, name: "Psiquiatra" },
  { id: 3, name: "Neurologista" },
  { id: 4, name: "Terapeuta" },
];

const organizations = [
  { id: 1, name: "Polícia Militar" },
  { id: 2, name: "Bombeiro Militar" },
  { id: 3, name: "Guarda Municipal" },
  { id: 4, name: "Polícia Penal" },
];

export default function RegisterProfessional() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showForm, setShowForm] = React.useState(false);
  const [professionals, setProfessionals] = React.useState<FormData[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isEditing, setIsEditing] = React.useState(false); // Controla o modo de edição
  const [editIndex, setEditIndex] = React.useState<number | null>(null); // Index do profissional em edição
  const itemsPerPage = 5;

  React.useEffect(() => {
    if (professionals.length === 0) {
      toast.error("Nenhum Profissional cadastrado.");
    }
  }, [professionals]);

  const onSubmit = (data: FormData) => {
    if (isEditing && editIndex !== null) {
      const updatedProfessionals = [...professionals];
      updatedProfessionals[editIndex] = data;
      setProfessionals(updatedProfessionals);
      console.log(updatedProfessionals);
      toast.success("Profissional atualizado com sucesso!");
    } else {
      setProfessionals((prev) => [...prev, data]);
      toast.success("Profissional cadastrado com sucesso!");
    }
    reset(); // Limpa o formulário após o envio
    setShowForm(false); // Oculta o formulário após cadastro ou edição
    setIsEditing(false); // Reseta o modo de edição
    setEditIndex(null); // Limpa o índice de edição
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleEdit = (index: number) => {
    const professional = professionals[index];
    setValue("fullName", professional.fullName);
    setValue("email", professional.email);
    setValue("phone", professional.phone);
    setValue("organization", professional.organization);
    setValue("specialty", professional.specialty);
    setShowForm(true); // Exibe o formulário de edição
    setIsEditing(true); // Marca que está no modo de edição
    setEditIndex(index); // Salva o índice do profissional em edição
  };

  const handleDelete = (index: number) => {
    const updatedProfessionals = professionals.filter((_, i) => i !== index);
    setProfessionals(updatedProfessionals);
    toast.success("Profissional deletado com sucesso!");
  };

  return (
    <Container maxWidth={false} sx={{ width: "100%", p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4">Cadastrar Profissional de Saúde</Typography>
      </Box>

      {/* Botão para exibir o formulário */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, marginBottom: 5 }}>
        <IconButton
          onClick={() => {
            setShowForm(true);
            reset(); // Limpa o formulário quando abrir para cadastro
            setIsEditing(false); // Reseta o modo de edição
            setEditIndex(null); // Limpa o índice de edição
          }}
          sx={{ bgcolor: "#03DAC6", "&:hover": { bgcolor: "#02c7" } }}
        >
          <AddIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      {/* Exibe o formulário de cadastro */}
      {showForm ? (
        <Box sx={{ mt: 3, marginBottom: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  {...register("fullName")}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName?.message}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  {...register("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  {...register("phone")}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  margin="normal"
                />
              </Grid>

              {/* Campo Órgão - Agora como um SELECT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Órgão"
                  {...register("organization")}
                  error={Boolean(errors.organization)}
                  helperText={errors.organization?.message}
                  margin="normal"
                >
                  {organizations.map((org) => (
                    <MenuItem key={org.id} value={String(org.id)}>
                      {org.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Campo Especialidade - Já era um SELECT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Especialidade"
                  {...register("specialty")}
                  error={Boolean(errors.specialty)}
                  helperText={errors.specialty?.message}
                  margin="normal"
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty.id} value={String(specialty.id)}>
                      {specialty.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Senha (padrão: 123456)"
                  {...register("password")}
                  value="123456"
                  disabled
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "#03DAC6",
                "&:hover": { bgcolor: "#02c7b5" },
                height: 58,
                borderRadius: 1
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </form>
        </Box>
      ) : null}

      {/* Tabela de Profissionais Cadastrados */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          Profissionais Cadastrados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome Completo</strong></TableCell>
                <TableCell><strong>E-mail</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Órgão</strong></TableCell>
                <TableCell><strong>Especialidade</strong></TableCell>
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {professionals
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((professional, index) => (
                  <TableRow key={index}>
                    <TableCell>{professional.fullName}</TableCell>
                    <TableCell>{professional.email}</TableCell>
                    <TableCell>{professional.phone}</TableCell>
                    <TableCell>{organizations.find((org) => org.id === professional.organization)?.name}</TableCell>
                    <TableCell>{specialties.find((spec) => spec.id === professional.specialty)?.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <MuiIconButton onClick={() => { handleEdit(index); }}>
                          <EditIcon sx={{ color: "#03DAC6" }} />
                          {/* Editar */}
                        </MuiIconButton>
                        <MuiIconButton onClick={() => { handleDelete(index); }}>
                          <DeleteIcon sx={{ color: "#F44336" }} />
                          {/* Excluir */}
                        </MuiIconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginação */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(professionals.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      {/* Toast Container for React Toastify */}
      <ToastContainer />
    </Container>
  );
}
