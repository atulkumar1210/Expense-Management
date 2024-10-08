import React, { useState, useEffect } from "react";
import { Form, Input, Layout, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
const { Header, Footer, Content } = Layout;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/users/register", values);
      message.success("Registeration Successfull");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("Email Already Registered");
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
      <div className="register-page ">
        {loading && <Spinner />}
        <Form layout="vertical" onFinish={submitHandler} className="boxx">
          <h1 className="h1">Register</h1>
          <Form.Item label="Name" name="name" className="item">
            <Input className="input"/>
          </Form.Item>
          <Form.Item label="Email" name="email" className="item">
            <Input type="email" className="input"/>
          </Form.Item>
          <Form.Item label="Password" name="password" className="item">
            <Input type="password" className="input"/>
          </Form.Item>
          <div className="register-login">
            <p>Already Registered?<Link to="/login"> Click Here to login</Link></p>
            <button className="btn btn-primary">Resgiter</button>
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

export default Register;