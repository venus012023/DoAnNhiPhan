"use client";

import { useState } from "react";
import { calculate, binaryToDecimal, decimalToBinary } from "./calculator";

const BlockDiagram = ({ operation, showDiagram }) => {
    const images = {
        Cộng: "/hinh/cong.jpg",
        Trừ: "/hinh/tru.jpg",
        Nhân: "/hinh/nhan.jpg",
        Chia: "/hinh/chia.jpg",
    };

    const imageSrc = images[operation];

    return (
        <div className="block-diagram">
            <h3 className="text-xl font-medium">{`Sơ đồ khối: ${operation}`}</h3>
            {showDiagram && imageSrc ? (
                <img src={imageSrc} alt={`Sơ đồ khối của phép ${operation}`} className="w-full h-auto mt-2" />
            ) : (
                <p>Không tìm thấy hình ảnh cho phép toán: {operation}</p>
            )}
        </div>
    );
};

export default function Home() {
    const [mode, setMode] = useState("Signed");
    const [operation, setOperation] = useState("Cộng");
    const [registryLength, setRegistryLength] = useState(4);
    const [operandA, setOperandA] = useState({ binary: "", decimal: "" });
    const [operandB, setOperandB] = useState({ binary: "", decimal: "" });
    const [result, setResult] = useState(null);
    const [errorMessageA, setErrorMessageA] = useState("");
    const [errorMessageB, setErrorMessageB] = useState("");
    const [showDiagram, setShowDiagram] = useState(true);

    const getDefaultDecimalRange = (length, isSigned) => {
        if (isSigned) {
            const min = -(2 ** (length - 1));
            const max = 2 ** (length - 1) - 1;
            return `${min} đến ${max}`;
        }
        return `0 đến ${2 ** length - 1}`;
    };

    const resetOperands = () => {
        setOperandA({ binary: "", decimal: "" });
        setOperandB({ binary: "", decimal: "" });
        setErrorMessageA("");
        setErrorMessageB("");
        setResult(null);
        setShowDiagram(true);
    };

    const handleModeChange = (newMode) => {
        resetOperands();
        setMode(newMode);
    };

    const validateBinaryInput = (binary) => /^[01]*$/.test(binary);

    const handleBinaryChangeA = (binary) => {
        if (!validateBinaryInput(binary) || binary.length > registryLength) {
            setErrorMessageA(`Nhập ${registryLength} bit nhị phân hợp lệ.`);
            return;
        }
        setErrorMessageA("");
        const decimal = binary ? binaryToDecimal(binary, mode === "Signed") : "";
        setOperandA({ binary: binary.padStart(registryLength, "0"), decimal });
    };

    const handleDecimalChangeA = (decimal) => {
        if (!/^-?\d*$/.test(decimal)) return;
        setOperandA((prev) => ({ ...prev, decimal }));

        const value = Number(decimal);
        const min = mode === "Signed" ? -(2 ** (registryLength - 1)) : 0;
        const max = mode === "Signed" ? 2 ** (registryLength - 1) - 1 : 2 ** registryLength - 1;

        if (value < min || value > max) {
            setErrorMessageA(`Giá trị phải nằm trong khoảng ${getDefaultDecimalRange(registryLength, mode === "Signed")}.`);
        } else {
            setErrorMessageA("");
            setOperandA((prev) => ({
                ...prev,
                binary: decimalToBinary(value, registryLength).padStart(registryLength, "0"),
            }));
        }
    };

    const handleBinaryChangeB = (binary) => {
        if (!validateBinaryInput(binary) || binary.length > registryLength) {
            setErrorMessageB(`Nhập ${registryLength} bit nhị phân hợp lệ.`);
            return;
        }
        setErrorMessageB("");
        const decimal = binary ? binaryToDecimal(binary, mode === "Signed") : "";
        setOperandB({ binary: binary.padStart(registryLength, "0"), decimal });
    };

    const handleDecimalChangeB = (decimal) => {
        if (!/^-?\d*$/.test(decimal)) return;
        setOperandB((prev) => ({ ...prev, decimal }));

        const value = Number(decimal);
        const min = mode === "Signed" ? -(2 ** (registryLength - 1)) : 0;
        const max = mode === "Signed" ? 2 ** (registryLength - 1) - 1 : 2 ** registryLength - 1;

        if (value < min || value > max) {
            setErrorMessageB(`Giá trị phải nằm trong khoảng ${getDefaultDecimalRange(registryLength, mode === "Signed")}.`);
        } else {
            setErrorMessageB("");
            setOperandB((prev) => ({
                ...prev,
                binary: decimalToBinary(value, registryLength).padStart(registryLength, "0"),
            }));
        }
    };

    const handleCalculate = () => {
        setShowDiagram(false);

        if (operandA.binary.length !== registryLength || operandB.binary.length !== registryLength) {
            setErrorMessageA(`Số A phải có độ dài ${registryLength} bit.`);
            setErrorMessageB(`Số B phải có độ dài ${registryLength} bit.`);
            return;
        }
        setErrorMessageA("");
        setErrorMessageB("");

        const calculationResult = calculate(operandA, operandB, operation, mode, registryLength);
        if (calculationResult.error) {
            alert(calculationResult.error);
            return;
        }
        setResult(calculationResult);
    };

    return (
        <div className="min-h-screen p-4 sm:p-10 bg-gray-100">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Tìm hiểu công nghệ jamstack và xây dựng ứng dụng web minh họa các giải thuật tính toán trên số nhị phân</h1>
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <div className="w-full md:w-1/2 bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Nhập liệu</h2>

                    <div className="mb-4">
                        <label className="block text-lg font-medium">Độ dài bit</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={registryLength}
                            onChange={(e) => setRegistryLength(Number(e.target.value))}
                            min={1}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium">Chế độ</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={mode}
                            onChange={(e) => handleModeChange(e.target.value)}
                        >
                            <option value="Signed">Có dấu</option>
                            <option value="Unsigned">Không dấu</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium">Phép toán</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                        >
                            <option value="Cộng">Cộng</option>
                            <option value="Trừ">Trừ</option>
                            <option value="Nhân">Nhân</option>
                            <option value="Chia">Chia</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-medium">Số A</h3>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={operandA.decimal}
                            onChange={(e) => handleDecimalChangeA(e.target.value)}
                            placeholder={`Thập phân (${getDefaultDecimalRange(registryLength, mode === "Signed")})`}
                        />
                        {errorMessageA && <div className="text-red-500">{errorMessageA}</div>}
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={operandA.binary}
                            onChange={(e) => handleBinaryChangeA(e.target.value)}
                            placeholder={`Nhị phân (${registryLength} bit)`}
                        />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-medium">Số B</h3>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={operandB.decimal}
                            onChange={(e) => handleDecimalChangeB(e.target.value)}
                            placeholder={`Thập phân (${getDefaultDecimalRange(registryLength, mode === "Signed")})`}
                        />
                        {errorMessageB && <div className="text-red-500">{errorMessageB}</div>}
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={operandB.binary}
                            onChange={(e) => handleBinaryChangeB(e.target.value)}
                            placeholder={`Nhị phân (${registryLength} bit)`}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCalculate}>
                            Tính toán
                        </button>
                        <button className="bg-gray-300 px-4 py-2 rounded" onClick={resetOperands}>
                            Làm mới
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-white p-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Kết quả</h2>
                    {result ? (
                        <>
                            <table className="w-full border-collapse border border-gray-300 mb-4">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Phép toán</th>
                                        <th className="border p-2">Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">Kết quả (Thập phân)</td>
                                        <td className="border p-2">{result.resultDecimal}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2">Kết quả (Nhị phân)</td>
                                        <td className="border p-2">{result.resultBinary}</td>
                                    </tr>
                                    {operation === "Chia" && (
                                        <>
                                            <tr>
                                                <td className="border p-2">Số dư (Thập phân)</td>
                                                <td className="border p-2">{result.decimalRemainder}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Số dư (Nhị phân)</td>
                                                <td className="border p-2">{result.binaryRemainder}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>

                            <h3 className="text-lg font-semibold">Các bước thực hiện:</h3>
                            <ol className="list-decimal pl-5">
                                {result.steps && result.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </>
                    ) : (
                        <div className="text-center">Chưa có kết quả</div>
                    )}

                    {/* Hiển thị sơ đồ khối */}
                    {result ? null : <BlockDiagram operation={operation} showDiagram={showDiagram} />}
                </div>
            </div>
            <footer className="mt-6 text-center text-gray-600">
                <p>Made by Thất Tùng, Gia Bảo</p>
            </footer>
        </div>
    );
}