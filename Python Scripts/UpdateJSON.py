import json
from os import listdir, rename, path

def updateJSON(filename, CashGrabURL, ipfsImageURL):
    
    with open(filename, "r") as jsonFile:
        data = json.load(jsonFile)

    data["external_url"] = CashGrabURL
    data["image"] = ipfsImageURL

    with open(filename, "w") as jsonFile:
        json.dump(data, jsonFile)

def shiftJSONbyIndex(filename, indexToShift, total):

    old_filename = filename
    # add shift
    oldIndex = int(path.basename(old_filename.replace('temp','')))
    newIndex = ((total - indexToShift) + oldIndex) % total
    print(str(newIndex))
    new_filename = str(newIndex)

    rename(old_filename, new_filename)

def createTempName(filename):
    # we need to create temp file names to start
    # since we are shifting all names
    new_filename = filename + 'temp'
    rename(filename, new_filename)

def shiftJSON(jsonFiles, amountToShift, totalSupply):
    for file in jsonFiles:
        filename = jsonFilePath + file
        createTempName(filename)
    for file in jsonFiles:
        filename = jsonFilePath + file
        shiftJSONbyIndex(filename, amountToShift, totalSupply)

#Read JSON File
#jsonFilePath = ''
#jsonFiles = [f for f in listdir(jsonFilePath)]

#amountToShift = 8853
#totalSupply = 10000
#shiftJSON(jsonFiles, amountToShift, totalSupply)





