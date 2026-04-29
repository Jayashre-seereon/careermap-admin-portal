import { useState } from "react";
import { Modal, Input, Switch, Select, message } from "antd";
import {
  ArrowLeftOutlined,
  WalletOutlined,
  BankOutlined,
  SwapOutlined,
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  BellOutlined,
  HistoryOutlined,
  StopOutlined,
  MailOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const THEME = {
  primary: "#9a2119",
  primaryHover: "#b5261d",
  primaryActive: "#7d1a14",
  primarySoft: "#fdf2f1",
  primaryBorder: "#f3c7c3",
  success: "#9a2119",
  danger: "#dc2626",
  dangerSoft: "#fef2f2",
  dangerBorder: "#fecaca",
};

const Btn = ({ onClick, icon, children, variant = "primary", className = "" }) => {
  const base =
    "inline-flex items-center gap-1 px-3 h-8 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border-0 outline-none";
  const variants = {
    primary: "bg-[#9a2119] text-white hover:bg-[#b5261d] active:bg-[#7d1a14]",
    danger: "bg-[#9a2119] text-white hover:bg-[#b5261d] active:bg-[#7d1a14]",
    teal: "bg-[#009688] text-white hover:bg-[#00796b] active:bg-[#005f56]",
    ghost: "bg-white text-[#9a2119] border border-[#9a2119] hover:bg-[#fdf2f1]",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div
    className="flex-1 rounded-xl p-4 flex items-center gap-4"
    style={{ background: `${accent}14`, border: `1.5px solid ${accent}30` }}
  >
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: accent, color: "#fff" }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-xl font-bold" style={{ color: accent }}>{value}</p>
    </div>
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const StyledModal = ({ open, title, icon, onOk, onCancel, okText, okColor = THEME.primary, children }) => (
  <Modal
    open={open}
    onOk={onOk}
    onCancel={onCancel}
    okText={okText || "Confirm"}
    okButtonProps={{
      style: { background: okColor, borderColor: okColor, fontWeight: 600 },
    }}
    cancelButtonProps={{ style: { fontWeight: 500 } }}
    title={
      <div className="flex items-center gap-2 text-base font-semibold" style={{ color: okColor }}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
    }
  >
    <div className="pt-2 flex flex-col gap-3">{children}</div>
  </Modal>
);

export default function UserDetails({ user, onBack, onNotify }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [balance, setBalance] = useState(
    parseFloat((user.balance || "$0").replace(/[$₹]/g, "")) || 0
  );
  const [transactions, setTransactions] = useState([]);
  const [isBanned, setIsBanned] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [reason, setReason] = useState("");

  const [info, setInfo] = useState({
    firstName: user.user?.split(" ")[0] || "",
    lastName: user.user?.split(" ")[1] || "",
    email: user.email || "",
    mobile: user.mobile || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zip: user.zip || "",
    country: user.country || "",
    emailVerified: user.emailVerified ?? true,
    mobileVerified: user.mobileVerified ?? true,
    twoFA: user.twoFA ?? false,
  });

  const set = (field, value) => setInfo((prev) => ({ ...prev, [field]: value }));

  const showStatusMessage = (type, text) => {
    if (type === "error") {
      messageApi.error(text);
      return;
    }

    messageApi.success(text);
  };

  const handleSave = () => showStatusMessage("success", "User information saved successfully.");

  const handleAdd = () => {
    if (!amount) return showStatusMessage("error", "Enter amount");
    setBalance((b) => b + parseFloat(amount));
    setTransactions((t) => [...t, { type: "Add", amount: parseFloat(amount), remark }]);
    showStatusMessage("success", "Balance added successfully.");
    setIsAddOpen(false);
    setAmount("");
    setRemark("");
  };

  const handleSub = () => {
    if (!amount) return showStatusMessage("error", "Enter amount");
    setBalance((b) => b - parseFloat(amount));
    setTransactions((t) => [...t, { type: "Subtract", amount: parseFloat(amount), remark }]);
    showStatusMessage("success", "Balance subtracted successfully.");
    setIsSubOpen(false);
    setAmount("");
    setRemark("");
  };

  const handleBan = () => {
    if (!reason) return showStatusMessage("error", "Enter reason");
    setIsBanned((b) => !b);
    showStatusMessage("success", `User ${isBanned ? "unbanned" : "banned"} successfully.`);
    setIsBanOpen(false);
    setReason("");
  };

  return (
    <div className="p-1 space-y-5">
      {contextHolder}

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#9a2119] hover:text-[#9a2119] transition"
        >
          <ArrowLeftOutlined />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#9a2119] leading-tight">
            {user.user}
          </h1>
          <p className="text-xs text-gray-400">{user.id} &bull; {user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>Add Balance</Btn>
        <Btn icon={<MinusOutlined />} onClick={() => setIsSubOpen(true)}>Subtract Balance</Btn>
        <Btn icon={<UserOutlined />}>Login as User</Btn>
        <Btn icon={<BellOutlined />} onClick={() => onNotify(user)}>Notifications</Btn>
        <Btn icon={<HistoryOutlined />}>Login History</Btn>
        <Btn icon={<StopOutlined />} onClick={() => setIsBanOpen(true)}>
          {isBanned ? "Unban User" : "Ban User"}
        </Btn>
        <Btn icon={<MailOutlined />} onClick={() => onNotify(user)}>Send Email</Btn>
      </div>

      <div className="flex gap-4">
        <StatCard icon={<WalletOutlined />} label="Balance" value={`₹${balance}`} accent="#9a2119" />
        <StatCard icon={<BankOutlined />} label="Deposits" value="₹0" accent="#9a2119" />
        <StatCard icon={<SwapOutlined />} label="Transactions" value={transactions.length} accent="#9a2119" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
        <h2 className="text-base font-bold text-gray-800">
          Information of {info.firstName} {info.lastName}
        </h2>

        <div className="flex flex-wrap gap-6">
          {[
            { label: "Email Verification", field: "emailVerified" },
            { label: "Mobile Verification", field: "mobileVerified" },
            { label: "2FA Verification", field: "twoFA" },
          ].map(({ label, field }) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={info[field]}
                onChange={(value) => set(field, value)}
                style={{ background: info[field] ? "#9a2119" : "#d1d5db" }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required>
            <Input value={info.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </Field>
          <Field label="Last Name" required>
            <Input value={info.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" required>
            <Input value={info.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Mobile Number" required>
            <Input value={info.mobile} onChange={(e) => set("mobile", e.target.value)} />
          </Field>
        </div>

        <Field label="Address">
          <Input value={info.address} onChange={(e) => set("address", e.target.value)} />
        </Field>

        <div className="grid grid-cols-4 gap-4">
          <Field label="City">
            <Input value={info.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label="State">
            <Input value={info.state} onChange={(e) => set("state", e.target.value)} />
          </Field>
          <Field label="Zip / Postal">
            <Input value={info.zip} onChange={(e) => set("zip", e.target.value)} />
          </Field>
          <Field label="Country">
            <Select
              value={info.country || undefined}
              placeholder="Select"
              onChange={(value) => set("country", value)}
              className="w-full"
              options={[
                { value: "India", label: "India" },
                { value: "USA", label: "USA" },
                { value: "UK", label: "UK" },
                { value: "Canada", label: "Canada" },
              ]}
            />
          </Field>
        </div>

        <div className="flex justify-end">
          <Btn variant="primary" icon={<SaveOutlined />} onClick={handleSave}>Save</Btn>
        </div>
      </div>

      <StyledModal
        open={isAddOpen}
        title="Add Balance"
        icon={<PlusOutlined />}
        okText="Add"
        okColor="#9a2119"
        onOk={handleAdd}
        onCancel={() => {
          setIsAddOpen(false);
          setAmount("");
          setRemark("");
        }}
      >
        <div className="bg-[#fdf2f1] border border-[#f3c7c3] rounded-lg p-3 text-sm text-[#9a2119] font-medium">
          Current Balance: <span className="font-bold">₹{balance}</span>
        </div>
        <Input
          prefix="₹"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </StyledModal>

      <StyledModal
        open={isSubOpen}
        title="Subtract Balance"
        icon={<MinusOutlined />}
        okText="Subtract"
        okColor="#9a2119"
        onOk={handleSub}
        onCancel={() => {
          setIsSubOpen(false);
          setAmount("");
          setRemark("");
        }}
      >
        <div className="bg-[#fdf2f1] border border-[#f3c7c3] rounded-lg p-3 text-sm text-[#9a2119] font-medium">
          Current Balance: <span className="font-bold">₹{balance}</span>
        </div>
        <Input
          prefix="₹"
          placeholder="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </StyledModal>

      <StyledModal
        open={isBanOpen}
        title={isBanned ? "Unban User" : "Ban User"}
        icon={<StopOutlined />}
        okText={isBanned ? "Unban" : "Ban"}
        okColor="#9a2119"
        onOk={handleBan}
        onCancel={() => {
          setIsBanOpen(false);
          setReason("");
        }}
      >
        <div className="bg-[#fdf2f1] border border-[#f3c7c3] rounded-lg p-3 text-sm text-[#9a2119]">
          You are about to <strong>{isBanned ? "unban" : "ban"}</strong>{" "}
          <strong>{user.user}</strong>. This action will be logged.
        </div>
        <Input
          placeholder="Reason *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </StyledModal>
    </div>
  );
}
