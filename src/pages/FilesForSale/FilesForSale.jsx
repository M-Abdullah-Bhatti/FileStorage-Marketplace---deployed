import React from "react";
import CardsSection from "../../components/FilesForSale/CardsSection";
import { Box, Text } from "@chakra-ui/react";

const FilesForSale = () => {
  return (
    <Box backgroundColor="#f2fffe" paddingTop="3em">
      <Text
        fontSize={{ base: "4xl", md: "5xl" }}
        textAlign="center"
        textTransform="uppercase"
        textColor="#0d8775"
        fontFamily="auto"
      >
        Files for sale
      </Text>
      <CardsSection isHomePage={false} />
    </Box>
  );
};

export default FilesForSale;
