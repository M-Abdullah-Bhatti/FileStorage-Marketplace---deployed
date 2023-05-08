import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Home/Hero";
import CardsSection from "../../components/FilesForSale/CardsSection";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box width={"100%"}>
      <Hero />
      <Box
        backgroundColor="#f2fffe"
        paddingTop="3em"
        textAlign={"center"}
        paddingBottom={10}
      >
        <Text
          fontSize={{ base: "4xl", md: "5xl" }}
          textAlign="center"
          textTransform="uppercase"
          textColor="#0d8775"
          fontFamily="auto"
        >
          Files for sale
        </Text>
        <CardsSection isHomePage={true} />
        <Button
          onClick={() => navigate("/filesforsale")}
          backgroundColor="black"
          fontSize={"lg"}
          textColor="white"
          width={{ base: "50%", md: "13%" }}
          textAlign={"center"}
          paddingY="1.4em"
          _hover={{
            backgroundColor: "blackAlpha.800",
          }}
        >
          Show All Files
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
