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
  useClipboard,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import SetFileForSaleModal from "../../components/Modals/SetFileForSaleModal";
import { ethers } from "ethers";
import JSEncrypt from "jsencrypt";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";
import axios from "axios";

import { BsFillClipboardFill } from "react-icons/bs";

import { useNavigate } from "react-router-dom";

const AllUploadedFiles = () => {
  const [currentPrivateKey, setCurrentPrivateKey] = useState("");
  const { onCopy, value, setValue, hasCopied } =
    useClipboard(currentPrivateKey);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [files, setFiles] = useState([]);

  const [
    totalFilesCountSharedAndUploaded,
    setTotalFilesCountSharedAndUploaded,
  ] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);
  const showPagination = files.length > itemsPerPage ? true : false;

  const [hash, setHash] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileId, setFileId] = useState(false);

  const handleClick = async (fileId) => {
    console.log(Number(fileId));
    // openModal();
    setFileId(fileId);
    onOpen();
  };

  const handleCopy = async (privateKey) => {
    onCopy();
    console.log(privateKey);
    setCurrentPrivateKey(privateKey);
    // openModal();
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
    const fetchAllMyUploadedFiles = async () => {
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
      const uploadedFiles = await contract.getAllMyUploadedFiles();
      const filesCountUploadedFiles = uploadedFiles.length;

      const filesWithPrivateKeys = await Promise.all(
        uploadedFiles.map(async (element) => {
          let encryptor = new JSEncrypt({ default_key_size: 2048 });

          const { data } = await axios.post(
            "https://wild-blue-barnacle-sock.cyclic.app/api/hash/getPrivateKey",
            {
              hashvalue: element.hash,
            }
          );
          return {
            ...element,
            privateKey: data.privateKey,
            publicKey: data.publicKey,
          };
        })
      );

      const sharedFiles = await contract.getAllMySharedFiles();
      const filesCountSharedFiles = sharedFiles.length;

      const totalFilesCountSharedAndUploaded =
        Number(filesCountUploadedFiles) + Number(filesCountSharedFiles);
      setTotalFilesCountSharedAndUploaded(totalFilesCountSharedAndUploaded);

      // Set the files state variable
      setFiles(filesWithPrivateKeys);
      setLoading(false);
    };

    fetchAllMyUploadedFiles();
  }, []);

  return (
    <>
      <Box paddingY="10" paddingX="4em" minHeight={"90vh"}>
        <Text
          mb={"2"}
          fontSize="5xl"
          // textAlign="center"
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"6em"}
          textTransform="uppercase"
          textColor="#0d8775"
          fontFamily="auto"
        >
          <Text fontSize="3xl" textTransform={"capitalize"} marginRight={"5em"}>
            Total Files: {totalFilesCountSharedAndUploaded}
          </Text>
          Dashboard
        </Text>

        <Text
          mb={"5"}
          fontSize="3xl"
          textAlign="center"
          textTransform="uppercase"
          textColor="#0d8775"
          fontFamily="auto"
        >
          All My Uploaded Files
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
                <Th fontSize="xl">Private Key</Th>
                <Th fontSize="xl">Public Key</Th>
                <Th fontSize="xl">File Price</Th>
                <Th fontSize="xl">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.length === 0 ? (
                <Tr>
                  <Text fontSize="3xl" textAlign="center" paddingY={10}>
                    You haven't uploaded any file
                  </Text>
                </Tr>
              ) : (
                currentItems.map((data, i) => (
                  <>
                    <SetFileForSaleModal
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

                      {/* privateKey */}

                      <Td>
                        {data.privateKey.slice(33, 60) + "..."}
                        <button onClick={() => handleCopy(data.privateKey)}>
                          <BsFillClipboardFill style={{ fontSize: "20px" }} />
                        </button>
                      </Td>

                      {/* publicKey */}

                      <Td>
                        {data.publicKey.slice(33, 60) + "..."}
                        <button onClick={() => handleCopy(data.publicKey)}>
                          <BsFillClipboardFill style={{ fontSize: "20px" }} />
                        </button>
                      </Td>

                      <Td>{`${ethers.utils.formatEther(data.price)} ETH`}</Td>
                      <Td>
                        <Button
                          // onClick={onOpen}
                          onClick={() => handleClick(data.fileId)}
                          colorScheme="teal"
                          backgroundColor="black"
                          size="lg"
                          marginX={"10px"}
                          _hover={{
                            backgroundColor: "blackAlpha.800",
                          }}
                        >
                          Set File For Sale
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
            totalItems={files.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Box>
    </>
  );
};

export default AllUploadedFiles;
