import React, { useState, useEffect } from "react";
import {
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  useDisclosure,
  Box,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import DeleteFileModal from "../../components/Modals/DeleteFileModal";
import { ethers } from "ethers";
import JSEncrypt from "jsencrypt";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllUnsharedFiles = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [unSharedFiles, setUnSharedFiles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = unSharedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const showPagination = unSharedFiles.length > itemsPerPage ? true : false;

  const [fileId, setFileId] = useState(false);

  const handleClick = async (fileId) => {
    setFileId(fileId);
    onOpen();
  };

  const click = async (hash) => {
    let encryptor = new JSEncrypt({ default_key_size: 2048 });

    const { data } = await axios.post(
      "https://wild-blue-barnacle-sock.cyclic.app/api/hash/getPrivateKey",
      {
        hashvalue: hash,
      }
    );

    encryptor.setPrivateKey(data.privateKey);
    let decrypted = encryptor.decrypt(hash);
    window.open(`https://gateway.pinata.cloud/ipfs/${decrypted}`, "_blank");
  };

  useEffect(() => {
    const fetchAllMyUnSharedFiles = async () => {
      // Connect to the contract using ethers.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });

      // Call the getAllMyUploadedFiles() function and retrieve the files
      const files = await contract.getAllMyUnSharedFiles();

      // Set the files state variable
      setUnSharedFiles(files);

      setLoading(false);
    };

    fetchAllMyUnSharedFiles();
  }, [unSharedFiles, account]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          paddingY="10"
          paddingX={{ base: "0.5em", md: "4em" }}
          minHeight={"90vh"}
        >
          <Text
            mb={"2"}
            fontSize={{ base: "3xl", md: "5xl" }}
            textAlign="center"
            textTransform="uppercase"
            textColor="#0d8775"
            fontFamily="auto"
          >
            Dashboard
          </Text>

          <Text
            mb={"5"}
            fontSize={{ base: "2xl", md: "3xl" }}
            textAlign="center"
            textTransform="uppercase"
            textColor="#0d8775"
            fontFamily="auto"
          >
            All My Unshared Files
          </Text>

          {/* Tables */}

          <TableContainer>
            <Table size="md" border="1px" borderColor="gray.200">
              <Thead>
                <Tr>
                  <Th paddingY="1em" fontSize="xl">
                    File Name
                  </Th>
                  <Th fontSize="xl">File Hash</Th>
                  <Th fontSize="xl">File Price</Th>
                  <Th fontSize="xl">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {unSharedFiles.length === 0 ? (
                  <Tr>
                    <Text fontSize="3xl" textAlign="center" paddingY={10}>
                      You haven't got any unshared file
                    </Text>
                  </Tr>
                ) : (
                  currentItems.map((data, i) => (
                    <>
                      <DeleteFileModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        fileId={fileId}
                      />
                      <Tr key={i}>
                        <Td>{data.name}</Td>
                        <Td>
                          <Link
                            fontWeight="light"
                            fontSize="md"
                            onClick={() => click(data.hash)}
                            isExternal
                          >
                            {data.hash.slice(0, 20) +
                              "..." +
                              data.hash.slice(-20)}{" "}
                            <ExternalLinkIcon mx="2px" />
                          </Link>
                        </Td>

                        <Td>{`${ethers.utils.formatEther(data.price)} ETH`}</Td>
                        <Td>
                          <Button
                            onClick={() => handleClick(data.fileId)}
                            colorScheme="red"
                            size="lg"
                            _hover={{
                              backgroundColor: "red.400",
                            }}
                          >
                            Delete File
                          </Button>
                        </Td>
                      </Tr>
                    </>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {showPagination && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={unSharedFiles.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default AllUnsharedFiles;
