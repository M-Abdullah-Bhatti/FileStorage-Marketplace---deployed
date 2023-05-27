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

export default function UnshareFileModal(props) {
  const { isOpen, onOpen, onClose, fileId } = props;
  const cancelRef = React.useRef();

  const navigate = useNavigate();

  const handleUnshareFile = async () => {
    try {
      console.log("fileId: ", Number(fileId), " unshare file modal called");

      // console.log(Number(fileId));
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(
      //   FileStorageMarketplace.address,
      //   FileStorageMarketplace.abi,
      //   signer
      // );

      // const tx = await contract.unshareFile(fileId);
      // onClose();

      // await tx.wait();
      // toast.success("File Unshared Successfully");
      // setTimeout(() => {
      //   navigate("/");
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
              <Button colorScheme="red" onClick={handleUnshareFile} ml={3}>
                Unshare
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
