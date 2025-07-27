const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");

const getSecureRandomIndex = (arrayLength) => {
  const randomBytes = CryptoJS.lib.WordArray.random(1);
  return Math.abs(randomBytes.words[0]) % arrayLength;
};

const generateRandomFunctionNameOptimized = (count = 10) => {
  const prefixes = [
    "get",
    "fetch",
    "load",
    "read",
    "obtain",
    "retrieve",
    "extract",
    "pull",
    "grab",
    "access",
    "decode",
    "parse",
    "build",
    "create",
    "make",
    "form",
    "init",
    "setup",
    "config",
    "process",
  ];
  const middles = [
    "Data",
    "Info",
    "Value",
    "Item",
    "Element",
    "Part",
    "Segment",
    "Block",
    "Chunk",
    "Piece",
    "Key",
    "Code",
    "Token",
    "String",
    "Text",
    "Content",
    "Buffer",
    "Stream",
    "Node",
    "Entry",
  ];
  const suffixes = [
    "A",
    "B",
    "C",
    "X",
    "Y",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Theta",
    "Lambda",
    "Sigma",
    "Omega",
    "Prime",
    "Core",
    "Base",
  ];

  const usedNames = new Set();
  const selectedNames = [];

  usedNames.add("getPasswordSecureData");
  usedNames.add("getEncryptedSecureData");

  const maxPossible = prefixes.length * middles.length * suffixes.length;

  if (count > maxPossible) {
    throw new Error(
      `Cannot generate ${count} unique names. Maximum possible: ${maxPossible}`
    );
  }

  let attempts = 0;
  const maxAttempts = maxPossible * 2;

  while (selectedNames.length < count && attempts < maxAttempts) {
    attempts++;

    const prefixIndex = getSecureRandomIndex(prefixes.length);
    const middleIndex = getSecureRandomIndex(middles.length);
    const suffixIndex = getSecureRandomIndex(suffixes.length);

    const prefix = prefixes[prefixIndex];
    const middle = middles[middleIndex];
    const suffix = suffixes[suffixIndex];
    const functionName = prefix + middle + suffix;

    if (!usedNames.has(functionName)) {
      usedNames.add(functionName);
      selectedNames.push(functionName);
    }
  }

  if (selectedNames.length < count) {
    throw new Error(
      `Could not generate ${count} unique names after ${attempts} attempts. Generated: ${selectedNames.length}`
    );
  }

  return selectedNames;
};

const splitString = (str, parts = 10) => {
  const stringParts = [];
  const partLength = Math.ceil(str.length / parts);

  for (let i = 0; i < parts; i++) {
    const start = i * partLength;
    const end = Math.min(start + partLength, str.length);
    stringParts.push(str.slice(start, end));
  }

  return stringParts;
};

const generateRandomHex = () => {
  const randomBytes = CryptoJS.lib.WordArray.random(1);
  return Math.abs(randomBytes.words[0]) % 256;
};

const obfuscateStringAdvancedHex = (str) => {
  const minArraySize = Math.max(str.length * 3, 32); // Ít nhất 32 bytes hoặc 3x độ dài string
  const arraySize = minArraySize + getSecureRandomIndex(17); // Random size trong range

  const hexArray = [];
  for (let i = 0; i < arraySize; i++) {
    hexArray.push(generateRandomHex());
  }

  const realIndices = [];
  const usedIndices = new Set();

  while (realIndices.length < str.length) {
    const randomIndex = getSecureRandomIndex(arraySize);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      realIndices.push(randomIndex);
    }
  }

  realIndices.sort((a, b) => a - b);

  for (let i = 0; i < str.length; i++) {
    hexArray[realIndices[i]] = str.charCodeAt(i);
  }

  return {
    hexArray: hexArray,
    realIndices: realIndices,
    arraySize: arraySize,
  };
};

const generateDummyPasswordData = () => {
  const dummyStrings = [
    "fake_pwd_123",
    "dummy_key_456",
    "placeholder_789",
    "mock_pass_abc",
    "test_secret_def",
    "sample_auth_ghi",
    "random_code_jkl",
    "noise_token_mno",
    "decoy_cred_pqr",
    "false_key_stu",
    "mislead_pass_vwx",
    "bogus_auth_yz",
  ];

  const randomIndex = getSecureRandomIndex(dummyStrings.length);
  return dummyStrings[randomIndex];
};

const generateDummyEncryptedData = () => {
  const dummyEncrypted = [
    "U2FsdGVkX19fake1234567890abcdef",
    "U2FsdGVkX18dummy567890abcdef123",
    "U2FsdGVkX17test890abcdef123456",
    "U2FsdGVkX16mock123456789abcdef",
    "U2FsdGVkX15sample456789abcdef12",
    "U2FsdGVkX14noise789abcdef123456",
    "U2FsdGVkX13decoy123456789abcde",
    "U2FsdGVkX12false456789abcdef123",
    "U2FsdGVkX11fake789abcdef123456",
    "U2FsdGVkX10dummy123456789abcde",
  ];

  const randomIndex = getSecureRandomIndex(dummyEncrypted.length);
  return dummyEncrypted[randomIndex];
};

const generateCppFiles = (password, encryptedMessage) => {
  const passwordParts = splitString(password, 10);
  const encryptedParts = splitString(encryptedMessage, 10);
  const obfuscatedPasswordParts = [];
  const obfuscatedEncryptedParts = [];

  const allFunctionNames = generateRandomFunctionNameOptimized(40);

  const realPasswordFunctionNames = allFunctionNames.slice(0, 10);
  const dummyPasswordFunctionNames = allFunctionNames.slice(10, 20);
  const realEncryptedFunctionNames = allFunctionNames.slice(20, 30);
  const dummyEncryptedFunctionNames = allFunctionNames.slice(30, 40);

  const mainPasswordFunctionName = "getPasswordSecureData";
  const mainEncryptedFunctionName = "getEncryptedSecureData";

  for (let i = 0; i < passwordParts.length; i++) {
    const obfuscated = obfuscateStringAdvancedHex(passwordParts[i]);
    obfuscatedPasswordParts.push(obfuscated);
  }

  for (let i = 0; i < encryptedParts.length; i++) {
    const obfuscated = obfuscateStringAdvancedHex(encryptedParts[i]);
    obfuscatedEncryptedParts.push(obfuscated);
  }

  // Generate PASSWORD HEADER FILE
  let passwordHeader = `#ifndef PASSWORD_FUNCTIONS_H
#define PASSWORD_FUNCTIONS_H

#include <string>
#include <vector>

// Auto-generated password functions with Advanced Hex obfuscation
// Generated at: ${new Date().toISOString()}
// Password functions: 10 real + 10 dummy + 1 main (FIXED NAME)
// Security: Advanced Hex with random indices and garbage bytes
// Main function: ${mainPasswordFunctionName}

`;

  // Generate real password functions với Advanced Hex
  for (let i = 0; i < realPasswordFunctionNames.length; i++) {
    const obfuscated = obfuscatedPasswordParts[i];

    passwordHeader += `// Password part ${i + 1} of ${
      realPasswordFunctionNames.length
    } (REAL) - Advanced Hex
std::string ${realPasswordFunctionNames[i]}() {
    const unsigned char data[${obfuscated.arraySize}] = {
        ${obfuscated.hexArray
          .map(
            (byte) => `0x${byte.toString(16).padStart(2, "0").toUpperCase()}`
          )
          .join(", ")}
    };
    
    // Extract real data from specific indices (anti-linear pattern)
    std::string result = "";
    const int realIndices[] = {${obfuscated.realIndices.join(", ")}};
    const int realCount = ${obfuscated.realIndices.length};
    
    for (int i = 0; i < realCount; i++) {
        result += static_cast<char>(data[realIndices[i]]);
    }
    
    return result;
}

`;
  }

  // Generate dummy password functions với Advanced Hex
  for (let i = 0; i < dummyPasswordFunctionNames.length; i++) {
    const dummyData = generateDummyPasswordData();
    const obfuscatedDummy = obfuscateStringAdvancedHex(dummyData);

    passwordHeader += `// Dummy password function ${
      i + 1
    } (DECOY) - Advanced Hex
std::string ${dummyPasswordFunctionNames[i]}() {
    const unsigned char data[${obfuscatedDummy.arraySize}] = {
        ${obfuscatedDummy.hexArray
          .map(
            (byte) => `0x${byte.toString(16).padStart(2, "0").toUpperCase()}`
          )
          .join(", ")}
    };
    
    // Extract dummy data from specific indices
    std::string result = "";
    const int realIndices[] = {${obfuscatedDummy.realIndices.join(", ")}};
    const int realCount = ${obfuscatedDummy.realIndices.length};
    
    for (int i = 0; i < realCount; i++) {
        result += static_cast<char>(data[realIndices[i]]);
    }
    
    return result; // Dummy: "${dummyData}"
}

`;
  }

  // Generate main password function
  passwordHeader += `// Main function to reconstruct password (FIXED NAME - only uses REAL functions)
std::string ${mainPasswordFunctionName}() {
    std::string password = "";
    
`;

  // Shuffle password indices
  const passwordIndices = Array.from({ length: 10 }, (_, i) => i);
  for (let i = passwordIndices.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [passwordIndices[i], passwordIndices[j]] = [
      passwordIndices[j],
      passwordIndices[i],
    ];
  }

  passwordHeader += `    std::vector<std::string> parts(10);
    
    // Only real password functions are called (Advanced Hex extraction)
`;

  for (let i = 0; i < passwordIndices.length; i++) {
    const realIndex = passwordIndices[i];
    passwordHeader += `    parts[${realIndex}] = ${
      realPasswordFunctionNames[realIndex]
    }(); // Real part ${realIndex + 1}
`;
  }

  passwordHeader += `    
    // Reconstruct password in correct order
    for (const auto& part : parts) {
        password += part;
    }
    
    return password;
}

// Dummy password calls for obfuscation
void initializePasswordDummies() {
`;

  const selectedPasswordDummies = [];
  for (let i = 0; i < 3; i++) {
    const passwordIndex = getSecureRandomIndex(
      dummyPasswordFunctionNames.length
    );
    if (!selectedPasswordDummies.includes(passwordIndex)) {
      selectedPasswordDummies.push(passwordIndex);
      passwordHeader += `    std::string dummyPwd${i + 1} = ${
        dummyPasswordFunctionNames[passwordIndex]
      }(); // Dummy call
`;
    }
  }

  passwordHeader += `}

#endif // PASSWORD_FUNCTIONS_H
`;

  // Generate ENCRYPTED HEADER FILE
  let encryptedHeader = `#ifndef ENCRYPTED_FUNCTIONS_H
#define ENCRYPTED_FUNCTIONS_H

#include <string>
#include <vector>

// Auto-generated encrypted message functions with Advanced Hex obfuscation
// Generated at: ${new Date().toISOString()}
// Encrypted functions: 10 real + 10 dummy + 1 main (FIXED NAME)
// Security: Advanced Hex with random indices and garbage bytes
// Main function: ${mainEncryptedFunctionName}

`;

  // Generate real encrypted functions với Advanced Hex
  for (let i = 0; i < realEncryptedFunctionNames.length; i++) {
    const obfuscated = obfuscatedEncryptedParts[i];

    encryptedHeader += `// Encrypted part ${i + 1} of ${
      realEncryptedFunctionNames.length
    } (REAL) - Advanced Hex
std::string ${realEncryptedFunctionNames[i]}() {
    const unsigned char data[${obfuscated.arraySize}] = {
        ${obfuscated.hexArray
          .map(
            (byte) => `0x${byte.toString(16).padStart(2, "0").toUpperCase()}`
          )
          .join(", ")}
    };
    
    // Extract real data from specific indices (anti-linear pattern)
    std::string result = "";
    const int realIndices[] = {${obfuscated.realIndices.join(", ")}};
    const int realCount = ${obfuscated.realIndices.length};
    
    for (int i = 0; i < realCount; i++) {
        result += static_cast<char>(data[realIndices[i]]);
    }
    
    return result;
}

`;
  }

  // Generate dummy encrypted functions với Advanced Hex
  for (let i = 0; i < dummyEncryptedFunctionNames.length; i++) {
    const dummyData = generateDummyEncryptedData();
    const obfuscatedDummy = obfuscateStringAdvancedHex(dummyData);

    encryptedHeader += `// Dummy encrypted function ${
      i + 1
    } (DECOY) - Advanced Hex
std::string ${dummyEncryptedFunctionNames[i]}() {
    const unsigned char data[${obfuscatedDummy.arraySize}] = {
        ${obfuscatedDummy.hexArray
          .map(
            (byte) => `0x${byte.toString(16).padStart(2, "0").toUpperCase()}`
          )
          .join(", ")}
    };
    
    // Extract dummy data from specific indices
    std::string result = "";
    const int realIndices[] = {${obfuscatedDummy.realIndices.join(", ")}};
    const int realCount = ${obfuscatedDummy.realIndices.length};
    
    for (int i = 0; i < realCount; i++) {
        result += static_cast<char>(data[realIndices[i]]);
    }
    
    return result; // Dummy: "${dummyData}"
}

`;
  }

  // Generate main encrypted function
  encryptedHeader += `// Main function to reconstruct encrypted message (FIXED NAME - only uses REAL functions)
std::string ${mainEncryptedFunctionName}() {
    std::string encrypted = "";
    
`;

  // Shuffle encrypted indices
  const encryptedIndices = Array.from({ length: 10 }, (_, i) => i);
  for (let i = encryptedIndices.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [encryptedIndices[i], encryptedIndices[j]] = [
      encryptedIndices[j],
      encryptedIndices[i],
    ];
  }

  encryptedHeader += `    std::vector<std::string> parts(10);
    
    // Only real encrypted functions are called (Advanced Hex extraction)
`;

  for (let i = 0; i < encryptedIndices.length; i++) {
    const realIndex = encryptedIndices[i];
    encryptedHeader += `    parts[${realIndex}] = ${
      realEncryptedFunctionNames[realIndex]
    }(); // Real part ${realIndex + 1}
`;
  }

  encryptedHeader += `    
    // Reconstruct encrypted message in correct order
    for (const auto& part : parts) {
        encrypted += part;
    }
    
    return encrypted;
}

// Dummy encrypted calls for obfuscation
void initializeEncryptedDummies() {
`;

  const selectedEncryptedDummies = [];
  for (let i = 0; i < 3; i++) {
    const encryptedIndex = getSecureRandomIndex(
      dummyEncryptedFunctionNames.length
    );
    if (!selectedEncryptedDummies.includes(encryptedIndex)) {
      selectedEncryptedDummies.push(encryptedIndex);
      encryptedHeader += `    std::string dummyEnc${i + 1} = ${
        dummyEncryptedFunctionNames[encryptedIndex]
      }(); // Dummy call
`;
    }
  }

  encryptedHeader += `}

#endif // ENCRYPTED_FUNCTIONS_H
`;

  return {
    passwordHeader: passwordHeader,
    encryptedHeader: encryptedHeader,
  };
};

const generateHeaderFile = (prefixPath, cipherText, password) => {
  const result = generateCppFiles(password, cipherText);
  fs.writeFileSync(
    path.join(prefixPath, "password_functions.h"),
    result.passwordHeader
  );
  fs.writeFileSync(
    path.join(prefixPath, "encrypted_functions.h"),
    result.encryptedHeader
  );
};

module.exports = {
  generateHeaderFile,
};
