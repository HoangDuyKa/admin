"use client";

import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Steps, notification } from "antd";
import { useState } from "react";

const ModalReactive = (props: any) => {
  const { userEmail, isModalOpen, setIsModalOpen } = props;
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState("");
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Call APIs Error",
        description: res?.error,
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      body: {
        _id: userId,
        code,
      },
    });
    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Call APIs Error",
        description: res?.error,
      });
    }
  };
  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
      >
        <Steps
          items={[
            {
              title: "Login",
              //   status: "finish",
              icon: <UserOutlined />,
            },
            {
              title: "Verification",
              //   status: "finish",
              icon: <SolutionOutlined />,
            },
            // {
            //   title: "Pay",
            //   status: "process",
            //   icon: <LoadingOutlined />,
            // },
            {
              title: "Done",
              //   status: "wait",
              icon: <SmileOutlined />,
            },
          ]}
          current={current}
        />
        {current === 0 && (
          <>
            <div style={{ margin: "20px 0" }}>
              Tài khoản của bạn chưa được kích hoạt
            </div>

            <Form
              name="basic"
              autoComplete="off"
              layout="vertical"
              onFinish={onFinishStep0}
            >
              <Form.Item
                label=""
                name="email"
                initialValue={userEmail}
                // rules={[
                //   {
                //     // required: true,
                //     message: "Please input your email!",
                //   },
                // ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi lại
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <div style={{ margin: "20px 0" }}>Vui lòng nhập mã xác nhận</div>

            <Form
              name="basic"
              autoComplete="off"
              layout="vertical"
              onFinish={onFinishStep1}
            >
              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Active
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <div style={{ margin: "20px 0" }}>
              Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập
              lại
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
