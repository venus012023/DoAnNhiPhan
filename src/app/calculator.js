// Hàm chuyển từ nhị phân sang thập phân
export function binaryToDecimal(binary, isSigned) {
  if (typeof binary !== 'string' || binary.length === 0) {
      throw new Error("Nhập liệu nhị phân không hợp lệ.");
  }

  let decimal = parseInt(binary, 2);
  if (isSigned && binary[0] === '1') {
      decimal -= Math.pow(2, binary.length);
  }
  return decimal;
}

// Hàm chuyển từ thập phân sang nhị phân
export function decimalToBinary(num, length) {
  if (num < 0) {
      num = (1 << length) + num;
  }
  return num.toString(2).padStart(length, '0');
}

// Hàm cộng nhị phân
export function addition(a, b) {
  let maxLength = Math.max(a.length, b.length);
  a = a.padStart(maxLength, '0');
  b = b.padStart(maxLength, '0');
  let carry = 0;
  let result = '';

  for (let i = maxLength - 1; i >= 0; i--) {
      let sum = carry + parseInt(a[i]) + parseInt(b[i]);
      result = (sum % 2) + result;
      carry = Math.floor(sum / 2);
  }

  return result.padStart(maxLength, '0');
}

// Hàm 1's Complement
export function onesComplement(num) {
  return num.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
}

// Hàm 2's Complement
export function twosComplement(num) {
  return addition(onesComplement(num), '1');
}

// Hàm nhân Booth
export function boothMultiplication(multiplicand, multiplier, bitLength) {
    // Chuyển đổi multiplicand và multiplier sang bù 2 nếu chúng là số âm
    let isMultiplicandNegative = multiplicand < 0;
    let isMultiplierNegative = multiplier < 0;

    let A = '0'.repeat(bitLength);
    let Q = decimalToBinary(Math.abs(multiplier), bitLength);
    let Q_1 = '0';
    let M = decimalToBinary(Math.abs(multiplicand), bitLength);
    let count = bitLength;
    let steps = [];

    steps.push(`Bắt đầu: A = ${A}, Q = ${Q}, Q-1 = ${Q_1}, M = ${M}, Count = ${count}`);

    while (count > 0) {
        const lastBitQ = Q[bitLength - 1];

        if (lastBitQ === '1' && Q_1 === '0') {
            A = addition(A, twosComplement(M)); // A = A - M
            steps.push(`A = A - M: A = ${A}`);
        } else if (lastBitQ === '0' && Q_1 === '1') {
            A = addition(A, M); // A = A + M
            steps.push(`A = A + M: A = ${A}`);
        } else {
            steps.push(`Không thay đổi A`);
        }

        Q_1 = lastBitQ;
        // Dịch phải
        const bitToShift = A[bitLength - 1];
        Q = bitToShift + Q.slice(0, bitLength - 1);
        A = A[0] + A.slice(0, bitLength - 1);

        steps.push(`Dịch phải: A = ${A}, Q = ${Q}, Q-1 = ${Q_1}, Count = ${count - 1}`);
        count--;
    }

    // Kết quả nhị phân
    let result = A + Q;
    let decimalResult = binaryToDecimal(result, true); // Chuyển đổi kết quả về thập phân

    // Điều chỉnh kết quả nếu một trong các đầu vào là số âm
    if (isMultiplicandNegative !== isMultiplierNegative) {
        decimalResult = -Math.abs(decimalResult); // Kết quả sẽ là số âm
    }

    return {
        binary: result,
        decimal: decimalResult,
        steps,
    };
}

// Hàm chia hai số nhị phân
export function binaryDivision(dividend, divisor, bitLength) {
    let isDividendNegative = dividend[0] === '1';
    let isDivisorNegative = divisor[0] === '1';
  
    if (isDividendNegative) {
        dividend = twosComplement(dividend);
    }
    if (isDivisorNegative) {
        divisor = twosComplement(divisor);
    }
    let A = '0'.repeat(bitLength);
    let Q = dividend;
    let M = divisor;
    let count = bitLength;
    let divisionSteps = [];
    divisionSteps.push(`Bắt đầu: A = ${A}, Q = ${Q}, M = ${M}, Count = ${count}`);
    while (count > 0) {
        A = A.slice(1) + Q[0]; // Dịch A sang trái và thêm bit đầu tiên của Q
        Q = Q.slice(1) + '0'; // Dịch Q sang trái và thêm 0 ở cuối
  
        A = addition(A, twosComplement(M)); // A = A - M
        divisionSteps.push(`A = A - M: A = ${A}`);
  
        if (A[0] === '0') {
            Q = Q.slice(0, bitLength - 1) + '1'; // Nếu A không âm, thêm 1 vào Q
        } else {
            Q = Q.slice(0, bitLength - 1) + '0';
            A = addition(A, M); // Nếu A âm, A = A + M
        }
  
        divisionSteps.push(`Sau bước: A = ${A}, Q = ${Q}, Count = ${count - 1}`);
        count--;
    }
    let quotient = Q;
    let remainder = A;
    if (isDividendNegative !== isDivisorNegative) {
        quotient = twosComplement(quotient); // Chuyển đổi thương về bù 2 nếu cần
    }
    if (isDividendNegative) {
        remainder = twosComplement(remainder); // Chuyển đổi số dư về bù 2 nếu cần
    }
    return {
        quotient,
        remainder,
        decimalQuotient: binaryToDecimal(quotient, true),
        decimalRemainder: binaryToDecimal(remainder, true),
        steps: divisionSteps,
    };
  }
// Hàm tính toán phép toán
export function calculate(operandA, operandB, operation, mode, registryLength) {
  if (!operandA.binary || !operandB.binary) {
      return { error: "Một trong các toán hạng không hợp lệ." };
  }

  const num1 = binaryToDecimal(operandA.binary, mode === 'Signed');
  const num2 = binaryToDecimal(operandB.binary, mode === 'Signed');
  let result, binaryResult, steps = [];

  switch (operation) {
      case 'Cộng':
          result = num1 + num2;
          binaryResult = decimalToBinary(result, registryLength);
          steps.push(`Cộng ${operandA.binary} và ${operandB.binary}: ${binaryResult}`);
          break;

      case 'Trừ':
          result = num1 - num2;
          binaryResult = decimalToBinary(result, registryLength);
          steps.push(`Trừ ${operandB.binary} từ ${operandA.binary}: ${binaryResult}`);
          break;

      case 'Nhân':
          const boothResult = boothMultiplication(num1, num2, registryLength);
          result = boothResult.decimal;
          binaryResult = boothResult.binary;
          steps = boothResult.steps; // Sử dụng steps của phép nhân
          break;

      case 'Chia':
          if (num2 !== 0) {
              const divisionResult = binaryDivision(operandA.binary, operandB.binary, registryLength);
              result = divisionResult.decimalQuotient;
              binaryResult = divisionResult.quotient;
              steps = divisionResult.steps; // Sử dụng steps của phép chia
              steps.push(`Chia ${operandA.binary} cho ${operandB.binary}: Thương = ${binaryResult}`);
              return {
                  resultBinary: binaryResult,
                  resultDecimal: result,
                  decimalRemainder: divisionResult.decimalRemainder,
                  binaryRemainder: divisionResult.remainder,
                  steps,
              };
          } else {
              return { error: 'Chia cho không' };
          }
          break;

      default:
          result = 0;
          binaryResult = decimalToBinary(result, registryLength);
  }

  return {
      resultBinary: binaryResult,
      resultDecimal: result,
      steps,
  };
}