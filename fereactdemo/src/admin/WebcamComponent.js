import React, { useEffect, useRef, useState } from "react";
import { scanQRCodeFromWebcam } from "../service/BanHangTaiQuay";

const WebcamComponent = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanResult, setScanResult] = useState("");

  // Mở webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Không thể mở webcam:", error);
      alert("Không thể truy cập webcam! Hãy kiểm tra quyền truy cập.");
    }
  };

  // Tắt webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Gọi API scan QR khi mở popup
  useEffect(() => {
    startWebcam();

    const scanQRCode = async () => {
      try {
        const response = await scanQRCodeFromWebcam();
        setScanResult(response.data); // Cập nhật kết quả quét
        onScanSuccess(response.data); // Trả kết quả về component cha
      } catch (error) {
        console.error("Lỗi khi quét QR:", error);
        alert("Không thể quét QR từ webcam.");
      }
    };

    scanQRCode(); // Gọi API scan QR khi webcam mở

    return () => stopWebcam(); // Tắt webcam khi đóng popup
  }, []);

  return (
    <div className="popup_webcam">
      <h2>Webcam</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "500px" }}
      ></video>
      {scanResult && <p>Kết quả quét: {scanResult}</p>}
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

export default WebcamComponent;
