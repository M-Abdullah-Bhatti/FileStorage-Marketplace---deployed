import {
  Card,
  CardHeader,
  Heading,
  Tooltip,
  Button,
  Icon,
  CardBody,
  Link,
  Text,
  CardFooter,
} from "@chakra-ui/react";
import { BsFillShareFill } from "react-icons/bs";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import JSEncrypt from "jsencrypt";

const CardComponent = (props) => {
  const navigate = useNavigate();
  const account = useAddress();

  const {
    onOpen,
    fileId,
    fileName,
    fileDescription,
    fileOwner,
    fileHash,
    filePrice,
  } = props;

  const handleBuy = async (fileId, filePrice) => {
    if (fileOwner === account) {
      toast.error("You can't buy your own file");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      FileStorageMarketplace.address,
      FileStorageMarketplace.abi,
      signer
    );

    filePrice = ethers.utils.parseEther(filePrice);
    const walletAddress = await signer.getAddress();

    const tx = await contract.buyFile(fileId, {
      from: walletAddress,
      value: filePrice._hex,
    });

    await tx.wait();
    toast.success("File Purchased Successfully");
    navigate("/filesforsale");
  };

  const handleShareModal = async (fileId) => {
    if (fileOwner !== account) {
      toast.error("You can't share others file");
      return;
    }
    onOpen();
    localStorage.setItem("fileId", fileId);
  };

  const handleLink = async (fileHash) => {
    let encryptor = new JSEncrypt({ default_key_size: 2048 });
    if (fileOwner == account) {
      const { data } = await axios.post(
        "https://wild-blue-barnacle-sock.cyclic.app/api/hash/getPrivateKey",
        {
          hashvalue: fileHash,
        }
      );

      encryptor.setPrivateKey(data.privateKey);
      let decrypted = encryptor.decrypt(fileHash);
      window.open(`https://gateway.pinata.cloud/ipfs/${decrypted}`, "_blank");
    } else {
      window.open(`https://gateway.pinata.cloud/ipfs/${fileHash}`, "_blank");
    }
  };
  return (
    <Card>
      <CardHeader
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="-1em"
      >
        <Heading fontFamily="auto" size="md">
          {" "}
          File id # {fileId}
        </Heading>
        <Tooltip label="Share File" placement="auto">
          <Button onClick={() => handleShareModal(fileId)}>
            {/* <Button onClick={onOpen}> */}
            <Icon as={BsFillShareFill} boxSize={6} />
          </Button>
        </Tooltip>
      </CardHeader>
      <CardBody>
        <Text textAlign="left" marginBottom="0.5em" fontFamily="auto">
          <Text fontWeight="bold" fontSize="lg" display="inline">
            {" "}
            Name:{" "}
          </Text>
          {fileName}
        </Text>
        <Text
          fontFamily="auto"
          textAlign="left"
          marginBottom="0.5em"
          overflowY={"auto"}
          height={"100px"}
        >
          <Text fontWeight="bold" fontSize="lg" display="inline">
            {" "}
            Description:{" "}
          </Text>
          {fileDescription}
        </Text>

        <Text fontFamily="auto" textAlign="left" marginBottom="0.5em">
          <Text fontWeight="bold" fontSize="lg" display="inline">
            {" "}
            Owner:{" "}
          </Text>
          {fileOwner === account
            ? "YOU"
            : `${fileOwner.slice(0, 16)}....${fileOwner.slice(-4)}`}
        </Text>

        <Text
          fontWeight="bold"
          fontSize="lg"
          fontFamily="auto"
          textAlign="left"
          marginBottom="0.5em"
        >
          {" "}
          View:{" "}
          <Link
            fontWeight="light"
            fontSize="md"
            onClick={() => handleLink(fileHash)}
            // href={`https://gateway.pinata.cloud/ipfs/${fileHash}`}
            isExternal
          >
            {fileHash.slice(0, 15) + "..." + fileHash.slice(-5)}{" "}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
        <Text fontFamily="auto" textAlign="left">
          <Text fontWeight="bold" fontSize="lg" display="inline">
            {" "}
            Price:{" "}
          </Text>
          {filePrice} ETH
        </Text>
      </CardBody>
      <CardFooter>
        <Button
          marginX="auto"
          backgroundColor="black"
          textColor="white"
          width="100%"
          paddingY="1.4em"
          _hover={{
            backgroundColor: "blackAlpha.800",
          }}
          onClick={() => handleBuy(fileId, filePrice)}
        >
          Buy File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardComponent;
