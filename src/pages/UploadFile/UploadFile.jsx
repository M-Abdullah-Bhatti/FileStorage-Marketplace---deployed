import {
  Flex,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import JSEncrypt from "jsencrypt";

import { fromByteArray } from "base64-js";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const projectId = "2NeEZqOeOOi9fQgDL6VoIMwKIZY";
const projectSecret = "b4ae65044a6e29c52c4091bf29a976b2";
const auth =
  "Basic " +
  fromByteArray(new TextEncoder().encode(`${projectId}:${projectSecret}`));

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function UploadFile() {
  const navigate = useNavigate();
  let encryptor = new JSEncrypt({ default_key_size: 2048 });
  let encryptedHash;

  let publicKey, privatekey;

  const [selectedFile, setSelectedFile] = useState();
  const [fileInfo, setFileInfo] = useState({
    name: "",
    description: "",
    ipfsHash: "",
  });

  const handleFileUpload = async () => {
    try {
      const added = await ipfs.add(selectedFile);
      fileInfo.ipfsHash = added.path;
      setFileInfo({
        ...fileInfo,
        ipfsHash: fileInfo.ipfsHash,
      });
      console.log(`https://gateway.pinata.cloud/ipfs/${fileInfo.ipfsHash}`);

      //   // First get both public and private Keys
      publicKey = encryptor.getPublicKey();
      privatekey = encryptor.getPrivateKey();

      // get encrypted hash which need to be stored in blockchain
      encryptor.setPublicKey(publicKey);
      encryptedHash = encryptor.encrypt(fileInfo.ipfsHash);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      const tx = await contract.uploadFile(
        fileInfo.name,
        fileInfo.description,
        encryptedHash
      );
      await tx.wait();

      await axios
        .post("https://wild-blue-barnacle-sock.cyclic.app/api/hash", {
          hashvalue: encryptedHash,
          privatekey: privatekey,
        })
        .then((res) => {
          toast.success("File Uploaded Successfully");
          navigate("/myalluploadedfiles");
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      flexDirection={"column"}
      fontFamily="auto"
      paddingTop={6}
      bg="#f2fffe"
    >
      <Text
        fontSize="5xl"
        textColor="#0d8775"
        textAlign="center"
        textTransform="uppercase"
      >
        Upload your File
      </Text>
      <Stack spacing={8} mx={"auto"} minW={"md"} pt={3} pb={10} px={6}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"xl"}
          border="2px"
          borderColor="gray.200"
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="text">
              <FormLabel fontWeight="bold">Name</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setFileInfo({ ...fileInfo, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="text">
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                size="md"
                minHeight="10em"
                onChange={(e) =>
                  setFileInfo({ ...fileInfo, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="file">
              <Input
                type="file"
                p={1}
                mb={2}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                marginX="auto"
                backgroundColor="black"
                textColor="white"
                width="100%"
                fontSize="lg"
                paddingY="1.4em"
                _hover={{
                  backgroundColor: "blackAlpha.800",
                }}
                onClick={handleFileUpload}
              >
                Upload File
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
