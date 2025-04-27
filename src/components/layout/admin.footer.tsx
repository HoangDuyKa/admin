"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        DuyKa ©{new Date().getFullYear()} Created by @DuyKa
      </Footer>
    </>
  );
};

export default AdminFooter;
