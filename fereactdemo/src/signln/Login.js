import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerInput from "../signln/CustomerInput";
import { loginCustomer, decodeToken } from "../service/LoginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const roles = decodeToken();
      const path = window.location.pathname;

      if (
        (roles.includes("ROLE_USER") && path.startsWith("/admin")) ||
        (!roles.includes("ROLE_ADMIN") && !roles.includes("ROLE_STAFF") && path.startsWith("/admin"))
      ) {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra role:", error);
      navigate("/login");
    }
  }, [navigate]);

  const loginButton = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email không được để trống");
      return;
    }
    if (!matKhau.trim()) {
      setError("Mật khẩu không được để trống");
      return;
    }
    try {
      const response = await loginCustomer(email, matKhau);
      console.log("Đăng nhập thành công:", response);
      localStorage.setItem("idGioHang", response.idGioHang);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      window.dispatchEvent(new Event("loginChange"));
      if (response.roles.includes("ROLE_ADMIN") || response.roles.includes("ROLE_STAFF")) {
        navigate("/admin");
      } else if (response.roles.includes("ROLE_USER")) {
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      let errorMessage = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.";
      if (error?.message) {
        if (error.message.startsWith("{")) {
          try {
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Lỗi khi parse lỗi đăng nhập:", e);
          }
        } else {
          errorMessage = error.message;
        }
      }
      setError(errorMessage);
    }
  };


  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center">Đăng nhập</h3>
        <p className="text-center">Hãy đăng nhập vào tài khoản của bạn.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {role && <div className="alert alert-success">Đăng nhập thành công</div>}

        <form onSubmit={loginButton}>
          <CustomerInput
            type="email"
            label="Email"
            i_id="email"
            i_class=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomerInput
            type="password"
            label="Mật khẩu"
            i_id="matKhau"
            i_class=""
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
          />
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 mt-3"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-3 text-center">
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/register" style={{ color: "#ffd333", textDecoration: "none" }}>
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
