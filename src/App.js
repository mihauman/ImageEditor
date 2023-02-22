import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ImageEditor from "./contracts/ImageEditor.json";
import fleekStorage from "@fleekhq/fleek-storage-js";

function ImageEditor() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [rightTurns, setRightTurns] = useState(0);
  const [leftTurns, setLeftTurns] = useState(0);
  const [verticalFlips, setVerticalFlips] = useState(0);
  const [horizontalFlips, setHorizontalFlips] = useState(0);
  const [currentImage, setCurrentImage] = useState([]);

  const ImageEditorContractAddress = "CONTRACT_ADDRESS_HERE";

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);

    const imageData = await contract.methods.userImageData(accounts[0]).call();

    setRightTurns(imageData.rightTurns);
    setLeftTurns(imageData.leftTurns);
    setVerticalFlips(imageData.verticalFlips);
    setHorizontalFlips(imageData.horizontalFlips);
    setCurrentImage(imageData.currentImage);
  }

  const handleTurnRight = async () => {
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);
      await contract.methods.turnRight().send({ from: account });
      setLoading(false);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleTurnLeft = async () => {
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);
      await contract.methods.turnLeft().send({ from: account });
      setLoading(false);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFlipHorizontally = async () => {
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);
      await contract.methods.flipHorizontally().send({ from: account });
      setLoading(false);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleFlipVertically = async () => {
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);
      await contract.methods.flipVertically().send({ from: account });
      setLoading(false);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    setLoading(true);

    try {
      const uploadedImage = await fleekStorage.upload({
        apiKey: "API_KEY_HERE",
        apiSecret: "API_SECRET_HERE",
        key: currentImage[0].name,
        data: currentImage[0],
      });

      const contract = new web3.eth.Contract(ImageEditor.abi, ImageEditorContractAddress);
      await contract.methods.saveImage(uploadedImage.hash).send({ from: account });
      setLoading(false);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setCurrentImage(e.target.files);
  };

  return (
    <div>
      <h1>Image Editor</h1>
      <p>Account: {account}</p>
      <p>Right turns: {rightTurns}</p>
      <p>Left turns: {leftTurns}</p>
      <p>Vertical flips: {verticalFlips}</p>
      <p>Horizontal flips: {horizontalFlips}</p>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <div>
        <button onClick={handleTurnLeft}>Turn Left</button>
        <button onClick={handleTurnRight}>Turn Right</button>
        <button onClick={handleFlipVertically}>Flip Vertically</button>
        <button onClick={handleFlipHorizontally}>Flip Horizontally</button>
        <button onClick={handleSaveImage}>Save Image</button>
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default ImageEditor;