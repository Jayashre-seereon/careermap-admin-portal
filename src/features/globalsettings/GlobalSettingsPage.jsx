import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Select, Button, Switch, message } from "antd";

const { Option } = Select;
const BRAND = "#9a2119";

const PRESETS = [
  "#ef4444","#f97316","#eab308","#a7e420","#22c55e",
  "#14b8a6","#3b82f6","#8b5cf6","#ec4899","#ff1ddd",
  "#9a2119","#000000","#6b7280","#ffffff",
];

function ColorPickerField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (hex) => {
    onChange(hex);
    message.success({ content: `Theme color updated to ${hex}`, key: "color-toast" });
    setOpen(false);
  };

  return (
    <Form.Item label={label} style={{ marginBottom: 12 }}>
      <div ref={ref} style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid #e5e7eb", borderRadius: 8,
            padding: "4px 10px", cursor: "pointer", background: "white",
          }}
        >
          <div style={{
            width: 44, height: 28, borderRadius: 5,
            background: value, border: "1px solid #e5e7eb", flexShrink: 0,
          }} />
          <Input
            value={value}
            bordered={false}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) handleChange(e.target.value);
            }}
            style={{ padding: 0, fontSize: 13 }}
          />
        </div>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
            background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
            padding: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", width: 220,
          }}>
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              style={{ width: "100%", height: 90, border: "none", borderRadius: 8, cursor: "pointer" }}
            />
            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: "10px 0 6px", textTransform: "uppercase" }}>
              Presets
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {PRESETS.map((c) => (
                <div
                  key={c}
                  onClick={() => handleChange(c)}
                  style={{
                    width: 22, height: 22, borderRadius: "50%", background: c,
                    cursor: "pointer", border: c === "#ffffff" ? "2px solid #e5e7eb" : "2px solid transparent",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Form.Item>
  );
}

export default function SiteSettings() {
  const [baseColor, setBaseColor] = useState("#a7e420");
  const [secondaryColor, setSecondaryColor] = useState("#ff1ddd");
  const [toggles, setToggles] = useState({
    userReg: true, emailVerify: false, emailNotif: true,
    mobileVerify: false, smsNotif: false, terms: true,
  });

  const handleSave = () => {
    message.success("Settings saved successfully.");
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "20px 32px", maxWidth: "100%", width: "100%" }}>
      <Form layout="vertical">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
          {/* Left Column */}
          <div>
            <Form.Item label={<>Site Title <span style={{ color: "red" }}>*</span></>} style={{ marginBottom: 12 }}>
              <Input defaultValue="No. 1 Career Counselling Organization in Odisha" />
            </Form.Item>
            <Form.Item label={<>Currency <span style={{ color: "red" }}>*</span></>} style={{ marginBottom: 12 }}>
              <Input defaultValue="INR700" />
            </Form.Item>
            <Form.Item label={<>Currency Symbol <span style={{ color: "red" }}>*</span></>} style={{ marginBottom: 12 }}>
              <Input defaultValue="RS" />
            </Form.Item>
            <Form.Item label={<>RTL/LTR <span style={{ color: "red" }}>*</span></>} style={{ marginBottom: 12 }}>
              <Select defaultValue="LTR" style={{ width: "100%" }}>
                <Option value="LTR">LTR</Option>
                <Option value="RTL">RTL</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Right Column */}
          <div>
            <Form.Item label="Timezone" style={{ marginBottom: 12 }}>
              <Select defaultValue="Asia/Kolkata" style={{ width: "100%" }}>
                <Option value="Asia/Kolkata">Asia/Kolkata</Option>
                <Option value="UTC">UTC</Option>
              </Select>
            </Form.Item>
            <ColorPickerField
              label="Theme Five Base Color"
              value={baseColor}
              onChange={setBaseColor}
            />
            <ColorPickerField
              label="Theme Five Secondary Color"
              value={secondaryColor}
              onChange={setSecondaryColor}
            />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, marginTop: 4, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {[
            ["userReg","User Registration"],["emailVerify","Email Verification"],
            ["emailNotif","Email Notification"],["mobileVerify","Mobile Verification"],
            ["smsNotif","SMS Notification"],["terms","Terms & Condition"],
          ].map(([key, label]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>{label}</span>
              <Switch
                checked={toggles[key]}
                onChange={(v) => setToggles((s) => ({ ...s, [key]: v }))}
                style={{ background: toggles[key] ? BRAND : undefined }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Button type="primary" onClick={handleSave}
            style={{ background: BRAND, borderColor: BRAND, paddingInline: 36 }}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}