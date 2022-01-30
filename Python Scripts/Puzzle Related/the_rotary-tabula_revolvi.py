import binascii
from collections import deque

# function to get unique values 
def unique(list1): 
  
    # intilize a null list 
    unique_list = [] 
      
    # traverse for all elements 
    for x in list1: 
        # check if exists in unique_list or not 
        if x not in unique_list: 
            unique_list.append(x) 
    # print list 
    for x in unique_list: 
        print (x), 

def printHex(xorStr):
    # Try to print Ascii after xor
    asciiStr = binascii.unhexlify('%x' % xorStr)
    #print(asciiStr)
    print(hex(asciiStr))

def printAscii(xorStr):
    # Try to print Ascii after xor
    asciiStr = binascii.unhexlify('%x' % xorStr)
    #print(asciiStr)
    print(asciiStr)

def buildBinStr(buildList, IsFlipped, InReverse):
    binStr = ""
    binStr4 = ""
    binStr6 = ""
    for x in buildList:
        if InReverse:
            x = x[::-1]
        if IsFlipped:
            x = flipBinary(x)
        binStr += ''.join(x)
        if len(x) == 6:
            binStr6 += ''.join(x)
        else:
            binStr4 += ''.join(x)
    return binStr, binStr4, binStr6

def flipBinary(binStrToFlip):
    fullStr = ""
    for idx, char in enumerate(binStrToFlip):
        binStrToFlip = 1 - int(char)
        fullStr += str(binStrToFlip)
    return fullStr

def RunSoulve(FirstBinList, RotatingBinList, IsFlipped, InReverse):

    binStrLeft, binStrLeft4, binStrLeft6 = buildBinStr(FirstBinList, IsFlipped, InReverse)
    #Build FirstBinList
   
    for count in range(len(RotatingBinList)):
        if count != 0:
            # Rebuild binary string after shift
            RotatingBinList.rotate(1)
            binStrRight, binStrRight4, binStrRight6 = buildBinStr(RotatingBinList, IsFlipped, InReverse)
        else:
             binStrRight, binStrRight4, binStrRight6 = buildBinStr(RotatingBinList, IsFlipped, InReverse)   
        binXorStr = int(binStrLeft, 2) ^ int(binStrRight, 2)
        try:
           printAscii(binXorStr)
        except binascii.Error as err:
            continue
        binXorStr6 = int(binStrLeft6, 2) ^ int(binStrRight6, 2)
        try:
            printAscii(binXorStr6)
        except binascii.Error as err:
            continue
        binXorStr4 = int(binStrLeft4, 2) ^ int(binStrRight4, 2)
        try:
            printAscii(binXorStr4)
        except binascii.Error as err:
            continue

def RunSoulve2(FirstBinList, RotatingBinList):
    binStr4Combined = ""
    binStr6Combined = ""
    for x,y in zip(FirstBinList, RotatingBinList):
        if len(x) == 4:
            #Reverse the Left side
            #x = x[::-1]
            binStr4Combined += x + y + "\n"
        else:
            binStr6Combined += x + y + "\n"
    print(binStr4Combined)
    print(binStr6Combined)

def RunSoulve3(leftlist, RotatingBinList):

    leftSideList = []
    rightSideList = []
    
    for x in range(0,34):
        idx = 0
        for y in leftlist:
            if len(y) == 6:
                binNum = int(y, 2)
                if(binNum == x):
                    if idx > 17:
                        idx = idx - 17
                    else:
                        idx = idx - 17 + 68
                    #print(leftlist[idx])
                    leftSideList.append(leftlist[idx])
            idx = idx + 1
    
    for x in range(0,34):
        idx = 0
        for y in RotatingBinList:
            if len(y) == 6:
                binNum = int(y, 2)
                if(binNum == x):
                    if idx > 51:
                        idx = idx - 51
                    else:
                        idx = idx - 51 + 68
                    #print(RotatingBinList[idx])
                    rightSideList.append(RotatingBinList[idx])
            idx = idx + 1
    binStrCombine = ""
    for x,y in zip(leftSideList,rightSideList):     
        binStrCombine += x+y
    printAscii(int(binStrCombine, 2))
        

left = deque(["000000","0101","001001","0101","010011","0101","000100","0101","011101","0101","001110","0100","011100","0100","010110","0100","001011","0100","001100","0100","010101","0100","001111","0101","011111","0100","001000","0100","000011","0100","001101","0100","010100","0100","010000","0100","100001","0100","010111","0101","000010","0100","100000","0100","010010","0100","011010","0100","010001","0100","000101","0101","011011","0101","011000","0101","011001","0101","000110","0100","011110","0101","000001","0101","000111","0101","001010","0101"])

right = deque(["001101","1110","001000","1111","001010","1110","000011","0100","010101","0101","100001","0101","000000","1111","001110","0111","010010","1000","010100","1000","010111","1111","011110","0001","010001","0101","011101","0001","001100","1001","000101","1001","011111","0001","011010","0101","010011","1111","010110","0010","001111","0111","001011","0001","000100","0100","000001","0101","011100","0101","100000","1000","011000","1010","010000","0000","000110","0100","011001","0010","011011","0010","000010","1111","000111","0100","001001","1100"])
"""
print("Running Soulve...")
RunSoulve(left, right, False, False)
print("\nRunning Soulve in Reverse...")
RunSoulve(left, right, False, True)"""

#right.rotate(56)
#RunSoulve2(left, right)

RunSoulve3(left, right)
