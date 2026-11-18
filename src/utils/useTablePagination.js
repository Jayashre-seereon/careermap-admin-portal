import { useState } from "react";

const DEFAULT_SIZE_OPTIONS = [10, 20, 50, 100];

// Controlled antd Table pagination. `total` is the number of rows currently
// shown (after filtering); the current page is clamped so serial numbers stay
// correct when a search shrinks the list.
export default function useTablePagination(total = 0, defaultPageSize = 10) {
  const [state, setState] = useState({ current: 1, pageSize: defaultPageSize });
  const maxPage = Math.max(1, Math.ceil((total || 0) / state.pageSize));
  const current = Math.min(state.current, maxPage);

  return {
    pagination: { current, pageSize: state.pageSize },
    tableProps: {
      pagination: {
        current,
        pageSize: state.pageSize,
        showSizeChanger: true,
        pageSizeOptions: DEFAULT_SIZE_OPTIONS,
      },
      onChange: (pag) => setState({ current: pag.current, pageSize: pag.pageSize }),
    },
  };
}
