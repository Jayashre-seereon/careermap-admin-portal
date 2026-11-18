import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getUsersPage } from "../../api/allusers";

export const formatUserRow = (item) => ({
  key: item.id,
  id: item.id,
  user: [item.firstName, item.lastName].filter(Boolean).join(" ") || item.username || "",
  email: item.email,
  mobile: item.mobile,
  status: String(item.status ?? "active").trim().toLowerCase(),
});

// Server-side paged + searched users list for a status tab ("" | "active" | "banned").
export default function useUsersPage(status = "") {
  // Search / page state is mirrored into the parent (AllUsers index) through
  // the outlet context so it survives tab switches and opening user details.
  const outlet = useOutletContext();
  const setListState = outlet?.setListState;
  const storeKey = status || "all";
  const saved = outlet?.listState?.[storeKey];
  const [search, setSearch] = useState(saved?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState((saved?.search ?? "").trim());
  const [page, setPage] = useState(saved?.page ?? 1);
  const [pageSize, setPageSize] = useState(saved?.pageSize ?? 10);
  const lastDebouncedRef = useRef((saved?.search ?? "").trim());
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = search.trim();
      setDebouncedSearch(next);
      // Only jump back to page 1 when the query actually changed (keeps the
      // restored page when the tab is re-mounted).
      if (next !== lastDebouncedRef.current) {
        lastDebouncedRef.current = next;
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setListState?.((prev) => ({ ...prev, [storeKey]: { search, page, pageSize } }));
  }, [search, page, pageSize, storeKey, setListState]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getUsersPage({
          page,
          limit: pageSize,
          search: debouncedSearch || undefined,
          status: status || undefined,
        });
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const nextTotal = res?.pagination?.total ?? list.length;
        // After a ban/refresh the current page may no longer exist; step back.
        if (list.length === 0 && page > 1 && nextTotal > 0) {
          setPage(Math.max(1, Math.ceil(nextTotal / pageSize)));
          return;
        }
        setRows(list.map(formatUserRow));
        setTotal(nextTotal);
      } catch (err) {
        if (!cancelled) {
          if (import.meta.env.DEV) console.error(err);
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, debouncedSearch, status, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const reset = () => {
    setSearch("");
    setDebouncedSearch("");
    lastDebouncedRef.current = "";
    setPage(1);
  };

  const tablePagination = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (t) => `${t} users`,
  };

  const onTableChange = (pag) => {
    setPage(pag.current);
    setPageSize(pag.pageSize);
  };

  const emptyText = debouncedSearch ? `No results for "${debouncedSearch}"` : "No users found";

  return { search, setSearch, rows, loading, reload, reset, tablePagination, onTableChange, emptyText, page, pageSize };
}
