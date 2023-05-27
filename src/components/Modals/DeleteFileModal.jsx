import React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function DeleteFileModal(props) {
  const { isOpen, onOpen, onClose, fileId } = props;
  const cancelRef = React.useRef();

  const navigate = useNavigate();

  const handleFileDelete = async () => {
    try {
      console.log("fileId: ", Number(fileId), " delete file modal called");

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(
      //   FileStorageMarketplace.address,
      //   FileStorageMarketplace.abi,
      //   signer
      // );
      // const tx = await contract.deleteFile(fileId);
      // onClose();
      // await tx.wait();
      // toast.success("File Deleted Successfully");
      // setTimeout(() => {
      //   navigate("/myallunsharedfiles");
      // }, 3000);
    } catch (error) {
      toast.error(error.message.ed);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete File
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleFileDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
