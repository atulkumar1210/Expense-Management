import React, { useState, useEffect } from "react";
import { Form, Input, Layout, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
const { Header, Footer, Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/users/login", values);
      setLoading(false);
      message.success("login success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("Either email or password is wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo">Expense Management System</div>
      </Header>
    <Content className="general-page">
      <div className="login-page ">
        {loading && <Spinner />}
        <Form layout="vertical" onFinish={submitHandler} className="boxx">
          <h1 className="h1">Login</h1>

          <Form.Item label="Email" name="email" className="item">
            <Input type="email" className="input"/>
          </Form.Item>
          <Form.Item label="Password" name="password" className="item">
            <Input type="password" className="input"/>
          </Form.Item>
          <div className="register-login">
            <p>Not a user? <Link to="/register">Click Here to regsiter</Link></p>
            <button className="btn btn-primary">Login</button>
          </div>
        </Form>
      </div>
    </Content>
    <Footer className="footer">
    All rights reserved &copy; Atul Kumar
    </Footer>
    </Layout>
  );
};

export default Login;