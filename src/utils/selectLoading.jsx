import { Spin } from "antd";

// Spread onto an antd <Select> while its options are still being fetched:
//   <Select {...selectLoadingProps(optionsLoading)} ... />
// The dropdown shows a spinner instead of "No data" until the API answers.
export const selectLoadingProps = (loading) =>
  loading ? { loading: true, notFoundContent: <Spin size="small" /> } : {};
