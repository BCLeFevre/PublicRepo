from UpdateJSON import updateJSON, shiftJSON
from os import listdir, path
from IPFSPinner import pinFileToIPFS
import hashlib

#Read JSON File
jsonFilePath = 'F:/Crypto/Cash Grab/Testing Dir/Json/'
imageFilePath = 'F:/Crypto/Cash Grab/Testing Dir/Images/'
jsonFiles = [f for f in listdir(jsonFilePath)]

imageDir = 'F:/Crypto/Cash Grab/Testing Dir/Images/'

def UploadToIPFS():
    for filename in listdir(imageDir):
        imageFilename = imageFilePath + filename
        ipfsHash = pinFileToIPFS(imageFilename, False)
        jsonFileName = path.splitext(jsonFilePath + filename)[0]
        #print(imageFilename, jsonFileName)
        updateJSON(jsonFileName, "http://", ipfsHash)

#amountToShift = 8853
#totalSupply = 10000
#shiftJSON(jsonFiles, amountToShift, totalSupply)

def createProvenanceHash(imageDir):
    provHash = ""
    for file in listdir(imageDir):
        sha256_hash = hashlib.sha256()
        with open(imageDir + file,"rb") as f:
            # Read and update hash string value in blocks of 4K
            for byte_block in iter(lambda: f.read(4096),b""):
                sha256_hash.update(byte_block)
            fileHash = sha256_hash.hexdigest()
        provHash = provHash + fileHash
    with open('F:/Crypto/Cash Grab/provenance.txt', 'w') as provFile:
        provFile.write(provHash)

createProvenanceHash(imageDir)


        
