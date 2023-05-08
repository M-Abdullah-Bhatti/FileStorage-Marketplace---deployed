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

export default function SetFileForSaleModal(props) {
  const { isOpen, onOpen, onClose, fileId } = props;
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();

  const handleSetFileForSale = async () => {
    try {
      console.log("fileId: ", Number(fileId));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      const tx = await contract.setFileForSale(
        fileId,
        ethers.utils.parseEther(price)
      );
      onClose();

      await tx.wait();
      toast.success("Price Set Successfully");
      setTimeout(() => {
        navigate("/filesforsale");
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
          <ModalHeader textTransform="uppercase">
            Set your file for sale
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Price:</FormLabel>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                min="0"
                placeholder="Price in ETH"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSetFileForSale} colorScheme="blue" mr={3}>
              Set For Sale
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
