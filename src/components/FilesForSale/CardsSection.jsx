import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import ShareFileModal from "../Modals/ShareFileModal";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import CardComponent from "./CardComponent";

export default function CardsSection({ isHomePage }) {
  const [filesForSale, setFilesForSale] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filesForSale.slice(indexOfFirstItem, indexOfLastItem);

  const showPagination = filesForSale.length > itemsPerPage ? true : false;
  let fileId;
  fileId = localStorage.getItem("fileId");
  useEffect(() => {
    const fetchGetFilesForSale = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      const filesForSale = await contract.getFilesForSale();

      // Set the files state variable
      setFilesForSale(filesForSale);
    };

    fetchGetFilesForSale();
  }, [filesForSale]);

  return (
    <>
      {filesForSale.length === 0 ? (
        <Box
          minHeight={"60vh"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text fontSize="4xl">Sorry, there's no file for sale right now</Text>
        </Box>
      ) : (
        <Box paddingBottom={10}>
          <SimpleGrid
            spacing={10}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            paddingTop={12}
            paddingBottom={5}
            paddingX={{ base: "1em", md: "10em" }}
            backgroundColor="#f2fffe"
          >
            {isHomePage
              ? currentItems.slice(0, 3).map((data, i) => (
                  <Box key={i}>
                    <ShareFileModal
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      fileId={fileId}
                    />
                    <CardComponent
                      fileId={Number(data.fileId)}
                      fileName={data.name}
                      fileDescription={data.description}
                      fileOwner={data.owner.toString()}
                      fileHash={data.hash}
                      filePrice={ethers.utils
                        .formatEther(data.price)
                        .toString()}
                      onOpen={onOpen}
                    />
                  </Box>
                ))
              : currentItems.map((data, i) => (
                  <Box key={i}>
                    <ShareFileModal
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      fileId={fileId}
                    />
                    <CardComponent
                      // account={account}
                      fileId={Number(data.fileId)}
                      fileName={data.name}
                      fileDescription={data.description}
                      fileOwner={data.owner.toString()}
                      fileHash={data.hash}
                      filePrice={ethers.utils
                        .formatEther(data.price)
                        .toString()}
                      onOpen={onOpen}
                    />
                  </Box>
                ))}
          </SimpleGrid>

          {!isHomePage && showPagination && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filesForSale.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Box>
      )}
    </>
  );
}
