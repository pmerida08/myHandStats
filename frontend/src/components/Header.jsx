import { Flex, Icon, Text, Avatar } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
/* import Sidebar from "./Sidebar";
 */
const Header = ({ texto, club }) => {
    // Obtener foto del usuario desde el token


    // Estado para controlar la apertura del Sidebar
/*     const [isSidebarOpen, setSidebarOpen] = useState(false);
 */

    return (
        <>
            <Flex align="center" justify="space-between" mb={8}>
                <Flex align="center" gap={3}>
                    {/* <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} /> */}
                </Flex>
                <Flex align="center" gap={3} position="absolute" left="50%" transform="translateX(-50%)">
                    <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
                        {texto}
                    </Text>

                </Flex>
                <Flex align="center" gap={2}>
                                      <Avatar
                        name={club.nombre}
                        src={club.logo}
                        mt={-2}
                        boxSize="50px"
                        marginTop={0.5}
                        style={{ filter: "drop-shadow(0 10px 10px rgba(0, 0, 0, 0.25))" }}
                    />
                </Flex>
            </Flex>
        </>
    );
};

export default Header;