import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import { useParams } from "react-router-dom";
const IFrame = () => {
  const { decrypted } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchWalletAddressess = async () => {
      let walletAddress = localStorage.getItem("walletAddress");

      // take user wallet address:
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userWalletAddress = await signer.getAddress();

      if (userWalletAddress == walletAddress) {
        setShow(true);
      }
    };

    fetchWalletAddressess();
  }, []);

  return (
    <>
      {show ? (
        <iframe
          title="My Content"
          src={`https://gateway.pinata.cloud/ipfs/${decrypted}`}
          style={{ width: "100%", height: "100vh", border: "none" }}
        ></iframe>
      ) : (
        <div>You don't have access to this page</div>
      )}
    </>
  );
};

export default IFrame;
