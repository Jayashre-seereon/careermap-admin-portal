import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getValueFromInput, inputSanitizers, validationRules } from "../../utils/formValidation";
import {
  createInstitute,
  deleteInstitute,
  getInstitutes,
  updateInstitute,
} from "../../api/institutions";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const normalizeList = (response) => {
  const list = response?.data;
  if (Array.isArray(list)) return list;
  if (list && typeof list === "object") return [list];
  return [];
};

// backend -> frontend
const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  email: item.email || "",
  contactPerson: item.contract_person || "",
  mobile: item.mobile || "",
  address: item.address || "",
  allowedStudents: item.limit ?? "",
});

// frontend -> backend
const buildInstitutePayload = ({
  name,
  email,
  password,
  contactPerson,
  mobile,
  address,
  allowedStudents,
}) => {
  const payload = {
    name,
    email,
    contract_person: contactPerson,
    mobile,
    address,
    limit: allowedStudents ? Number(allowedStudents) : undefined,
  };

  if (password) {
    payload.password = password;
  }

  return payload;
};

function InstituteForm({ form, mode, initialValues, onSubmit, onCancel }) {
  const isView = mode === "view";
  const isAdd = mode === "add";

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
        rules={[validationRules.required("Name"), validationRules.maxLength(100, "Name")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={isView} placeholder="Enter institute name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[validationRules.required("Email"), validationRules.email("Email")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={isView} placeholder="Enter email" />
      </Form.Item>

      {!isView && (
        <Form.Item
          name="password"
          label="Password"
          rules={isAdd ? [validationRules.required("Password")] : []}
        >
          <Input.Password
            placeholder={isAdd ? "Enter password" : "Leave blank to keep current password"}
          />
        </Form.Item>
      )}

      <Form.Item
        name="contactPerson"
        label="Contact Person"
        rules={[
          validationRules.required("Contact person"),
          validationRules.maxLength(100, "Contact person"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={isView} placeholder="Enter contact person" />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="Mobile"
        rules={[validationRules.required("Mobile"), validationRules.phone("Mobile")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.phone)}
      >
        <Input disabled={isView} placeholder="Enter mobile number" maxLength={15} />
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
        <Input disabled={isView} placeholder="Enter allowed students" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        className="md:col-span-2"
        rules={[validationRules.required("Address"), validationRules.maxLength(300, "Address")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input.TextArea disabled={isView} rows={4} placeholder="Enter address" />
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{isView ? "Back" : "Cancel"}</Button>
        {!isView && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {mode === "edit" ? "Update Institute" : "Create Institute"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function Institute() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadInstitutes = async () => {
    try {
      setLoading(true);
      const response = await getInstitutes();
      setData(normalizeList(response).map(mapInstitute));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load institutes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutes();
  }, []);

  const filteredData = data.filter((item) =>
    [item.name, item.email, item.address, item.contactPerson, item.mobile, item.allowedStudents]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const columns = [
    { title: "SL", width: 70, render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", width: 180 },
    { title: "Email", dataIndex: "email", width: 220 },
    { title: "Address", dataIndex: "address", width: 240, render: (v) => v || "-" },
    { title: "Contact Person", dataIndex: "contactPerson", width: 180, render: (v) => v || "-" },
    { title: "Mobile", dataIndex: "mobile", width: 150, render: (v) => v || "-" },
    { title: "Allowed Students", dataIndex: "allowedStudents", width: 160, render: (v) => v || "-" },
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

  async function handleDelete(record) {
    try {
      await deleteInstitute(record.id);
      messageApi.success("Institute deleted successfully.");
      await loadInstitutes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete institute."));
    }
  }

  async function handleSubmit(values) {
    try {
      const payload = buildInstitutePayload(values);

      if (mode === "edit" && selectedRecord) {
        await updateInstitute(selectedRecord.id, payload);
        messageApi.success("Institute updated successfully.");
      } else {
        await createInstitute(payload);
        messageApi.success("Institute created successfully.");
      }

      handleClose();
      await loadInstitutes();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit" ? "Failed to update institute." : "Failed to create institute."
        )
      );
    }
  }

  return (
    <div className="space-y-5">
      {contextHolder}
      <h2 className="text-xl font-bold text-[#9a2119]">Institute Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Institutes</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search institutes..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          loading={loading}
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
        title={mode === "view" ? "View Institute" : mode === "edit" ? "Edit Institute" : "Add Institute"}
      >
        <InstituteForm
          form={form}
          mode={mode}
          initialValues={selectedRecord}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}