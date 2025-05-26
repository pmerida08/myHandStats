import React, { useState, useEffect } from "react";
import {
    Box,
    Input,
    Button,
    Avatar,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    useToast,
    Flex,
    Icon,
    useDisclosure,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import AuthWrapper from "../components/AuthWrapper"; // Asegúrate de tener este componente

const EditarPerfil = () => {
    const [usuario, setUsuario] = useState(null);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState("");
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const cargarPerfil = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUsuario(user);
                setEmail(user.email);

                const { data, error } = await supabase
                    .from("usuarios")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (!error && data) {
                    setNombre(data.nombre || "");
                    setFotoUrl(data.foto_url || "");
                }
            }
        };

        cargarPerfil();
    }, []);

    const handleGuardar = async () => {
        try {
            let nuevaFotoUrl = fotoUrl;

            if (foto) {
                const extension = foto.name.split(".").pop();
                const nombreArchivo = `perfil_${usuario.id}.${extension}`;
                const { error: uploadError } = await supabase.storage
                    .from("imagenes")
                    .upload(nombreArchivo, foto, { upsert: true });

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from("imagenes").getPublicUrl(nombreArchivo);

                nuevaFotoUrl = publicUrl;
            }

            const { error } = await supabase
                .from("usuarios")
                .update({
                    nombre,
                    foto_url: nuevaFotoUrl,
                    fecha_actualizacion: new Date(),
                })
                .eq("id", usuario.id);

            if (error) throw error;

            if (contraseña) {
                const { error: passError } = await supabase.auth.updateUser({
                    password: contraseña,
                });
                if (passError) throw passError;
            }

            toast({
                title: "Perfil actualizado",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error al actualizar perfil",
                description: error.message,
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    return (
        <AuthWrapper requiredRole={null}>
            <Box p={4} position="relative">
                <Sidebar isOpen={isOpen} onClose={onClose} />
                <Flex direction="column" gap={6}>
                    <Flex align="center" mb={6} gap={3}>
                        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
                        <Heading>Editar Perfil</Heading>
                    </Flex>
                    <VStack spacing={4} align="stretch">
                        <Avatar size="xl" src={fotoUrl} />
                        <FormControl>
                            <FormLabel>Foto de perfil</FormLabel>
                            <Input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input value={email} isDisabled />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Nueva Contraseña</FormLabel>
                            <Input
                                type="password"
                                placeholder="Deja en blanco si no quieres cambiarla"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </FormControl>

                        <Button colorScheme="teal" onClick={handleGuardar}>
                            Guardar Cambios
                        </Button>
                    </VStack>
                </Flex>
            </Box>
        </AuthWrapper>
    );
};

export default EditarPerfil;
