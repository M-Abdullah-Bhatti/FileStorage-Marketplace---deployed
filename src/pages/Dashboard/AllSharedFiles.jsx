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
import UnshareFileModal from "../../components/Modals/UnshareFileModal";
import { ethers } from "ethers";
import JSEncrypt from "jsencrypt";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";

import axios from "axios";

import { useNavigate } from "react-router-dom";

const AllSharedFiles = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);

  const [sharedFiles, setSharedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sharedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const showPagination = sharedFiles.length > itemsPerPage ? true : false;
  const [loading, setLoading] = useState(true);

  const [fileId, setFileId] = useState("");

  const handleClick = async (fileId) => {
    console.log(Number(fileId));
    // openModal();
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
    const fetchAllMySharedFiles = async () => {
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

      const files = await contract.getAllMySharedFiles();

      // Set the files state variable
      setSharedFiles(files);
      setLoading(false);
    };

    fetchAllMySharedFiles();
  }, [account]);

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
            All My Shared Files
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
                  <Th fontSize="xl">Shared With</Th>
                  <Th fontSize="xl">Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {sharedFiles.length === 0 ? (
                  <Tr>
                    <Text fontSize="3xl" textAlign="center" paddingY={10}>
                      You haven't shared any file
                    </Text>
                  </Tr>
                ) : (
                  currentItems.map((data, i) => (
                    <>
                      <UnshareFileModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        fileId={fileId}
                      />
                      <Tr key={i}>
                        <Td>{data?.name}</Td>
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
                        <Td>{`${data?.sharedWith?.slice(
                          0,
                          16
                        )}....${data?.sharedWith?.slice(-8)}`}</Td>
                        <Td>
                          <Button
                            onClick={() => handleClick(data.fileId)}
                            colorScheme="teal"
                            backgroundColor="black"
                            size="lg"
                            _hover={{
                              backgroundColor: "blackAlpha.800",
                            }}
                          >
                            Unshare File
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
              totalItems={sharedFiles.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default AllSharedFiles;
