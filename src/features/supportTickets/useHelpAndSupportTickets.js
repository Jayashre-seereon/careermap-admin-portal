import { useCallback, useEffect, useState } from "react";
import { getHelpAndSupports, updateHelpAndSupportStatus } from "../../api/helpandsupport";
import { mapSupportTicket, normalizeList, normalizeStatus } from "./supportTicketsUtils";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export default function useHelpAndSupportTickets(messageApi) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHelpAndSupports();
      setTickets(normalizeList(response).map(mapSupportTicket));
    } catch (error) {
      messageApi?.error(getApiErrorMessage(error, "Failed to load support tickets."));
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const updateTicketStatus = useCallback(
    async (ticketId, status) => {
      const normalizedStatus = normalizeStatus(status);
      await updateHelpAndSupportStatus(ticketId, normalizedStatus);
      messageApi?.success("Ticket status updated successfully.");
      await loadTickets();
    },
    [loadTickets, messageApi]
  );

  return {
    tickets,
    loading,
    reloadTickets: loadTickets,
    updateTicketStatus,
  };
}
