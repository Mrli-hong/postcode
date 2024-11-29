import { Modal, Input, Form, Button, Select, Space, Divider } from "antd";
import type { InputRef, FormProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { callVscode } from "@/utils/vscode";
import * as React from "react";
import * as propTypes from "prop-types";

export const SaveMenuModal = ({ isModalVisible, setIsModalVisible }) => {
  type FieldType = {
    folderName: string;
  };
  const [folderName, setFolderName] = React.useState("");

  const [items, setItems] = React.useState([
    { folderName: "saa", folderId: "xxx" },
  ]);

  const inputRef = React.useRef<InputRef>(null);

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const onFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([...items, { folderName, folderId: "22" }]);
    setFolderName("");
    // inputRef.current?.focus();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  React.useEffect(() => {
    callVscode("getFolderList");
  });
  return (
    <Modal open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="folderName"
          name="folderName"
          rules={[{ required: true, message: "Please input  folderName!" }]}
        >
          <Select
            style={{ width: 300 }}
            placeholder="请输入文件夹名称"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={folderName}
                    onChange={onFolderName}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            options={items.map((item) => ({
              label: item.folderName,
              value: item.folderId,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

SaveMenuModal.propTypes = {
  isModalVisible: propTypes.bool,
  setIsModalVisible: propTypes.func,
};
