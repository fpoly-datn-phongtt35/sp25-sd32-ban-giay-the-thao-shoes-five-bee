import React, { useRef, useState } from "react";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Mở webcam
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  return (
    <div>
      <h2>Webcam Live</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px" }}></video>
      <br />
      <button onClick={startWebcam}>Mở Webcam</button>
      <button onClick={stopWebcam} style={{ marginLeft: "10px" }}>Tắt Webcam</button>
    </div>
  );
};

export default WebcamComponent;
