// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ImageEditor {
    struct ImageData {
        uint rightTurns;
        uint leftTurns;
        uint verticalFlips;
        uint horizontalFlips;
        uint[3][3] currentImage;
    }

    mapping (address => ImageData) private userImageData;

    function turnRight() public {
        ImageData storage data = userImageData[msg.sender];
        uint[3][3] memory newImage;
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                newImage[i][j] = data.currentImage[3 - j - 1][i];
            }
        }
        data.currentImage = newImage;
        data.rightTurns++;
    }

    function turnLeft() public {
        ImageData storage data = userImageData[msg.sender];
        uint[3][3] memory newImage;
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                newImage[i][j] = data.currentImage[j][3 - i - 1];
            }
        }
        data.currentImage = newImage;
        data.leftTurns++;
    }

    function flipVertically() public {
        ImageData storage data = userImageData[msg.sender];
        uint[3][3] memory newImage;
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                newImage[i][j] = data.currentImage[3 - i - 1][j];
            }
        }
        data.currentImage = newImage;
        data.verticalFlips++;
    }

    function flipHorizontally() public {
        ImageData storage data = userImageData[msg.sender];
        uint[3][3] memory newImage;
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                newImage[i][j] = data.currentImage[i][3 - j - 1];
            }
        }
        data.currentImage = newImage;
        data.horizontalFlips++;
    }
}