import { Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NavButtons = ({ isMobileScreen }) => {
  const navigate = useNavigate();
  return (
    <Stack
      flex={{ base: 1, md: 0 }}
      justify={isMobileScreen ? "flex-start" : "flex-end"}
      direction={"row"}
      spacing={6}
      display={
        isMobileScreen
          ? { base: "flex", md: "none" }
          : { base: "none", md: "flex" }
      }
    >
      <Button
        onClick={() => navigate("/login")}
        fontSize={isMobileScreen ? "sm" : "lg"}
        fontWeight={400}
        variant={"link"}
        to={"/login"}
        textColor="black"
      >
        Login In
      </Button>

      <Button
        onClick={() => navigate("/signup")}
        display={
          isMobileScreen
            ? { base: "inline-flex", md: "none" }
            : { base: "none", md: "inline-flex" }
        }
        fontSize={isMobileScreen ? "sm" : "lg"}
        fontWeight={600}
        color={"white"}
        backgroundColor="black"
        to={"/signup"}
        _hover={{
          bg: "black.300",
        }}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default NavButtons;
