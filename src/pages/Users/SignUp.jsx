import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(null);

  // function to signup user:
  const handleSignupSubmit = async () => {
    try {
      await axios
        .post("https://wild-blue-barnacle-sock.cyclic.app/api/user/signup", {
          username,
          email,
          phone,
          password,
        })
        .then((result) => {
          // toast.success("Nft created successfully");
          toast.success("user register successfully");
          navigate("/login");
          // setTimeout(() => {
          //   window.location.reload(true);
          // }, "2000");
        })

        .catch((error) => toast.error(error.response.data.message));
    } catch (error) {
      console.log("catch error: ", error.message);
    }
  };

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      fontFamily={"sans-serif"}
      bg="#f2fffe"
    >
      <Stack spacing={8} mx={"auto"} minW={"lg"} py={10} px={6}>
        <Stack align={"center"}>
          <Heading
            fontSize={"5xl"}
            fontWeight="semi-bold"
            textAlign={"center"}
            fontFamily={"auto"}
            textColor="#0d8775"
          >
            CREATE ACCOUNT
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          border="2px"
          borderColor="gray.200"
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="number" isRequired>
              <FormLabel>Phone no</FormLabel>
              <Input
                type="number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleSignupSubmit}
                marginX="auto"
                backgroundColor="black"
                textColor="white"
                width="100%"
                paddingY="1.4em"
                _hover={{
                  backgroundColor: "blackAlpha.800",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link to="/login" fontSize="lg">
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
