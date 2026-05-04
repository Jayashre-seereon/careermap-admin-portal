import React from "react";
import { Switch } from "antd";

const THEME_COLOR = "#9a2119";
const OFF_COLOR = "#d1d5db";

export default function StatusSwitch({ checked, style, ...props }) {
  return (
    <Switch
      checked={checked}
      style={{
        background: checked ? THEME_COLOR : OFF_COLOR,
        ...style,
      }}
      {...props}
    />
  );
}
