import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function ShareFileModal(props) {
  const { isOpen, onOpen, onClose, fileId } = props;
  const [sharedAddress, setSharedAddress] = useState("");
  const navigate = useNavigate();

  const handleShareFile = async () => {
    try {
      console.log(Number(fileId));

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      const tx = await contract.shareFile(fileId, sharedAddress);
      onClose();

      await tx.wait();
      toast.success("File Shared Successfully");
      setTimeout(() => {
        navigate("/myallsharedfiles");
      }, 3000);
    } catch (error) {
      toast.error(error.message.ed);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl" // sets the size of the modal
        isCentered // centers the modal on the screen
      >
        <ModalOverlay />
        <ModalContent
          w="80%" // sets the width of the modal content
          maxW="500px" // sets the maximum width of the modal content
          mx="auto" // centers the modal content horizontally
        >
          <ModalHeader textTransform="uppercase">Share your file</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>To:</FormLabel>
              <Input
                value={sharedAddress}
                onChange={(e) => setSharedAddress(e.target.value)}
                placeholder="Paste the address of the user"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleShareFile} colorScheme="blue" mr={3}>
              Share File
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
