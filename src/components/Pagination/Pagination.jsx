import React from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mt="8" textAlign={"center"}>
      <ButtonGroup spacing="2">
        {pageNumbers.map((number) => (
          <Button
            padding={5}
            key={number}
            bg={currentPage === number ? "black" : "white"}
            color={currentPage === number ? "white" : "black"}
            _hover={{ bg: currentPage === number ? "black" : "gray.200" }}
            _active={{ bg: currentPage === number ? "black" : "gray.300" }}
            isActive={currentPage === number}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default Pagination;
