import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getValueFromInput, inputSanitizers, validationRules } from "../../utils/formValidation";

const INITIAL_DATA = [
  {
    id: "institute-1",
    name: "Career Map Institute",
    email: "info@careermap.io",
    address: "Bhubaneswar, Odisha",
    contactPerson: "Admin Team",
    mobile: "9876543210",
    allowedStudents: "250",
  },
];

function InstituteForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          validationRules.required("Name"),
          validationRules.maxLength(100, "Name"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter institute name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          validationRules.required("Email"),
          validationRules.email("Email"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        name="contactPerson"
        label="Contact Person"
        rules={[
          validationRules.required("Contact person"),
          validationRules.maxLength(100, "Contact person"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter contact person" />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="Mobile"
        rules={[
          validationRules.required("Mobile"),
          validationRules.phone("Mobile"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.phone)}
      >
        <Input disabled={viewMode} placeholder="Enter mobile number" maxLength={15} />
      </Form.Item>

      <Form.Item
        name="allowedStudents"
        label="Allowed Students"
        rules={[
          validationRules.required("Allowed students"),
          validationRules.numbersOnly("Allowed students"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.numbersOnly)}
      >
        <Input disabled={viewMode} placeholder="Enter allowed students" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        className="md:col-span-2"
        rules={[
          validationRules.required("Address"),
          validationRules.maxLength(300, "Address"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input.TextArea disabled={viewMode} rows={4} placeholder="Enter address" />
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Institute" : "Create Institute"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function Institute() {
  const [form] = Form.useForm();
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((item) =>
      [item.name, item.email, item.address, item.contactPerson, item.mobile, item.allowedStudents]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const isViewMode = mode === "view";

  const columns = [
    {
      title: "SL",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 240,
      render: (value) => value || "-",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Allowed Students",
      dataIndex: "allowedStudents",
      width: 160,
      render: (value) => value || "-",
    },
    {
      title: "Action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EyeOutlined />}
            onClick={() => handleOpenView(record)}
          />
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this institute?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  function handleOpenAdd() {
    setMode("add");
    setSelectedRecord(null);
    form.resetFields();
    setOpen(true);
  }

  function handleOpenView(record) {
    setMode("view");
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  function handleOpenEdit(record) {
    setMode("edit");
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setMode("add");
    setSelectedRecord(null);
    form.resetFields();
  }

  function handleDelete(record) {
    setData((prev) => prev.filter((item) => item.id !== record.id));
  }

  function handleSubmit(values) {
    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...item, ...values } : item))
      );
    } else {
      setData((prev) => [...prev, { id: `institute-${Date.now()}`, ...values }]);
    }

    handleClose();
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Institute Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Institutes</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search institutes..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
            />

            <Button
              onClick={() => setSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={handleOpenAdd}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <PlusOutlined />
              Add Institute
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
        destroyOnClose
        title={
          mode === "view"
            ? "View Institute"
            : mode === "edit"
              ? "Edit Institute"
              : "Add Institute"
        }
      >
        <InstituteForm
          form={form}
          initialValues={selectedRecord}
          viewMode={isViewMode}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}

