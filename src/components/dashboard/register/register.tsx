/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  orgao_id: z.coerce.string().min(1, { message: "Informe um órgão válido" }),
  specialty_id: z.coerce.string().min(1, { message: "Informe uma especialidade" }),
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

interface UserType {
  orgao_id?: {
    _id?: string;
    name?: string;
  };
}

interface SpecialtyType {
  _id: string;
  name: string;
}


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
  const [professionals, setProfessionals] = React.useState([]);
  const [specialty, setSpecialty] = React.useState<SpecialtyType[]>([]);
  const [userOrg, setUserOrg] = React.useState<any[]>([]);
  const [user, setUser] = React.useState<UserType>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isEditing, setIsEditing] = React.useState(false); // Controla o modo de edição
  const [editIndex, setEditIndex] = React.useState<number | null>(null); // Index do profissional em edição
  const itemsPerPage = 5;

  React.useEffect(() => {
    // if (professionals.length === 0) {
    //   toast.error("Nenhum Profissional cadastrado.");
    // }
    getSpecialty()
    // getUserOrg()
  }, []);

  const getSpecialty = async () => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const dados: any = JSON.parse(localStorage.getItem('spacialty-user-value') ?? 'null');
      setUser(dados)

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
      setSpecialty(response.data.specialties);
      console.log('bb', response.data)

      const response1 = await api.get(`specialtyUser/specialtyOrg/${dados?.orgao_id?._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserOrg(response1.data.users);
      console.log('MM', response1.data)
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
      toast.error("Erro ao carregar especialidades");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("custom-auth-token");
      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        orgao_id: data.orgao_id,
        specialty_id: data.specialty_id,
        password: "123456",
      };

      if (isEditing && editIndex) {
        await api.put(`specialtyUser/update/${editIndex}`, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserOrg((prev) =>
          prev.map((p) =>
            p._id === String(editIndex) ? { ...p, ...requestData } : p
          )
        );

        toast.success("Profissional atualizado com sucesso!");
      } else {
        const response = await api.post("specialtyUser/specialtyUser", requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserOrg((prev) => [...prev, response.data]);

        toast.success("Profissional cadastrado com sucesso!");
      }

      // Atualiza os dados chamando a API novamente para refletir as mudanças
      await getSpecialty();

      // Reseta o formulário
      reset();
      setShowForm(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      toast.error("Erro ao salvar profissional");
    }
  };


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


  const handleEdit = (professional: any) => {
  // Define os valores do formulário com os dados do profissional selecionado
  setValue("name", professional.name);
  setValue("email", professional.email);
  setValue("phone", professional.phone);
  setValue("orgao_id", professional.orgao_id?._id);
  setValue("specialty_id", professional.specialty_id?._id);

  setShowForm(true); // Exibe o formulário de edição
  setIsEditing(true); // Define o modo de edição
  setEditIndex(professional._id); // Armazena o ID do profissional que está sendo editado
};



  const handleDelete = async (professional: any) => {
    try {
      const token = localStorage.getItem("custom-auth-token");

      await api.delete(`specialtyUser/delete/${professional?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualiza o estado removendo o item excluído
      setUserOrg((prev) => prev.filter((p) => p._id !== professional?._id));

      toast.success("Profissional excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      toast.error("Erro ao excluir profissional");
    }
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
                  {...register("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
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
                  {...register("orgao_id")}
                  error={Boolean(errors.orgao_id)}
                  helperText={errors.orgao_id?.message}
                  margin="normal"
                >
                  {/* {organizations.map((org) => ( */}
                    <MenuItem key={user?.orgao_id?._id} value={String(user.orgao_id?._id)}>
                      {user?.orgao_id?.name}
                    </MenuItem>
                  {/* ))} */}
                </TextField>
              </Grid>

              {/* Campo Especialidade - Já era um SELECT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Especialidade"
                  {...register("specialty_id")}
                  error={Boolean(errors.specialty_id)}
                  helperText={errors.specialty_id?.message}
                  margin="normal"
                >
                  {specialty.map((specialty) => (
                    <MenuItem key={specialty._id} value={String(specialty._id)}>
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
            {Array.isArray(userOrg) && userOrg.length > 0 ? (
  userOrg
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((professional, index) => (
      <TableRow key={index}>
        <TableCell>{professional?.name}</TableCell>
        <TableCell>{professional?.email}</TableCell>
        <TableCell>{professional?.phone}</TableCell>
        <TableCell>{professional?.orgao_id?.name}</TableCell>
        <TableCell>{professional?.specialty_id?.name}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <MuiIconButton onClick={() => { handleEdit(professional); }}>
              <EditIcon sx={{ color: "#03DAC6" }} />
            </MuiIconButton>
            <MuiIconButton onClick={() => { handleDelete(professional); }}>
              <DeleteIcon sx={{ color: "#F44336" }} />
            </MuiIconButton>
          </Box>
        </TableCell>
      </TableRow>
    ))
) : (
  <TableRow>
    <TableCell colSpan={5} align="center">
      Nenhum profissional cadastrado.
    </TableCell>
  </TableRow>
)}

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
