import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { adminLogin } from "../Action/action";
import Cookies from "js-cookie";
import config from "../coreFIles/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [eyelogin, seteyelogin] = useState(true);

  const loginData = Cookies.get("Code_Maya_Assignment");

  useEffect(() => {
    if (loginData) {
      window.location.href = `${config.baseUrl}user-list`;
    }
  }, [loginData]);

  // Login validation
  const validateLogin = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return errors;
  };

  // Login formik
  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validate: validateLogin,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const payload = {
          email: values.email,
          password: values.password
        };

        const res = await adminLogin(payload);

        if (res.success === true) {
          toast.success(res.msg);

          Cookies.set("Code_Maya_Assignment", JSON.stringify(res.data));

          const userPermissions = res.data.user.permissions;

          if (userPermissions.includes("read:users")) {
            window.location.href = `${config.baseUrl}user-list`;
          } else {
            window.location.href = "/403";
          }
        }

  } catch (error) {
    toast.error("Something went wrong. Please try again later.");
  } finally {
    setLoading(false);
  }
},
  });

return (
  <>
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar
      toastStyle={{ backgroundColor: "#010000", color: "#fff" }}
    />

    <div className="position-relative bg-img" style={{ height: "100vh" }}>
      <div className="mask"></div>
      <div className="hold-transition theme-primary">
        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="shadow-lg admin-login">

                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-white">Admin Panel</h2>
                      <p className="mb-0">Sign in to continue to Admin Panel</p>
                    </div>

                    <div style={{ padding: "10px 40px 40px 40px" }}>

                      {/* LOGIN FORM */}
                      <form onSubmit={loginFormik.handleSubmit}>

                        <div className="form-group text-start">
                          <label className="text-white mb-1">Email</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter email"
                            name="email"
                            value={loginFormik.values.email}
                            onChange={loginFormik.handleChange}
                            onBlur={loginFormik.handleBlur}
                          />
                          {loginFormik.touched.email && loginFormik.errors.email && (
                            <div className="text-danger">{loginFormik.errors.email}</div>
                          )}
                        </div>

                        <div className="form-group text-start mt-3">
                          <label className="text-white mb-1">Password</label>
                          <div className="position-relative">
                            <input
                              type={eyelogin ? "password" : "text"}
                              className="form-control"
                              placeholder="Password"
                              name="password"
                              value={loginFormik.values.password}
                              onChange={loginFormik.handleChange}
                              onBlur={loginFormik.handleBlur}
                            />
                            <button
                              type="button"
                              className="btn-link btn-sm position-absolute top-50 end-0 translate-middle-y bg-transparent border-0"
                              onClick={() => seteyelogin(!eyelogin)}
                              style={{ right: "10px", cursor: "pointer" }}
                            >
                              {eyelogin ? <FaEyeSlash fill="gray" /> : <FaEye fill="gray" />}
                            </button>
                          </div>

                          {loginFormik.touched.password && loginFormik.errors.password && (
                            <div className="text-danger">{loginFormik.errors.password}</div>
                          )}

                          <button
                            type="submit"
                            className="btn btn-primary mt-15"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                Loading &nbsp;
                                <span className="spinner-border spinner-border-sm"></span>
                              </>
                            ) : (
                              "SIGN IN"
                            )}
                          </button>
                        </div>
                      </form>

                      {/* END LOGIN FORM */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default Login;
