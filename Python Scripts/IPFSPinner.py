#ipfs pin
import requests, json, os
import pinataAuth

APIKey = pinataAuth.APIKey
APISecret = pinataAuth.APISecret
JWT = pinataAuth.JWT

pinJSONToIPFSurl = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
pinFileToIPFSurl = "https://api.pinata.cloud/pinning/pinFileToIPFS"

headers = {'pinata_api_key': APIKey, 'pinata_secret_api_key': APISecret}

def pinJSONToIPFS(filename):
    with open(filename, "r") as jsonFile:
        data = json.load(jsonFile)
        r = requests.post(pinJSONToIPFSurl, data=data, headers=headers)
        jsonResponse = r.json()
        IPFSHash = jsonResponse['IpfsHash']
        return IPFSHash

def pinFileToIPFS(filename, withDir):
    pinataOptions = {'wrapWithDirectory': withDir}
    filesToUpload = [('file', (os.path.basename(filename), open(filename, 'rb'))), ('pinataOptions', (None, json.dumps(pinataOptions), 'application/json'))]
    return makeRequest(pinFileToIPFSurl, filesToUpload)

def pinDirectoryToIPFS(directory):

    baseFilePath = "/Json/"
    filesToUpload = []
    for f in os.listdir(directory):
        fileTup = ('file', (baseFilePath + f, open(directory + f, 'rb')))
        filesToUpload.append(fileTup)
        
    return makeRequest(pinFileToIPFSurl, filesToUpload)
    
def makeRequest(url, filesToUpload):
    r = requests.post(url, files=filesToUpload, headers=headers)
    #print(r.text)
    jsonResponse = r.json()
    IPFSHash = jsonResponse['IpfsHash']
    return IPFSHash

#filename = "F:/Crypto/Cash Grab/Testing Dir/Json/1"
#pinFileToIPFS(filename, False)
#pinJSONToIPFS(filename)

#jsonDir = "F:/Crypto/Cash Grab/Testing Dir/JSON/"
#pinDirectoryToIPFS(jsonDir)
