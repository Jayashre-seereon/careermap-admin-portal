import { useMemo, useState } from "react";
import { Modal, Table, Tag } from "antd";
import PlansTable from "./PlansTable";
import PlansForm from "./PlansForm";
import { initialPlans, initialSubscriptions } from "./planData";

export default function PlansPage() {
  const [data, setData] = useState(initialPlans);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedPlanUsers, setSelectedPlanUsers] = useState(null);

  const subscriptionsByPlan = useMemo(() => {
    return initialSubscriptions.reduce((accumulator, subscription) => {
      const planKey = subscription.planKey;
      accumulator[planKey] = [...(accumulator[planKey] || []), subscription];
      return accumulator;
    }, {});
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setViewMode(false);
  };

  const handleSubmit = (values) => {
    if (selected) {
      setData((prev) =>
        prev.map((item) => (item.key === selected.key ? { ...item, ...values } : item))
      );
    } else {
      setData((prev) => [...prev, { key: Date.now().toString(), ...values }]);
    }

    handleClose();
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  return (
    <>
      <PlansTable
        data={data}
        subscriptionsByPlan={subscriptionsByPlan}
        onAdd={() => {
          setSelected(null);
          setViewMode(false);
          setOpen(true);
        }}
        onView={(data) => {
          setSelected(data);
          setViewMode(true);
          setOpen(true);
        }}
        onEdit={(data) => {
          setSelected(data);
          setViewMode(false);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onViewUsers={(plan) => setSelectedPlanUsers(plan)}
      />

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
      >
        <PlansForm
          onSubmit={handleSubmit}
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>

      <Modal
        open={Boolean(selectedPlanUsers)}
        onCancel={() => setSelectedPlanUsers(null)}
        footer={null}
        width={900}
        title={
          <span className="text-[#9a2119] font-semibold">
            Subscriptions{selectedPlanUsers ? ` - ${selectedPlanUsers.name}` : ""}
          </span>
        }
      >
        <Table
          rowKey="id"
          pagination={false}
          dataSource={subscriptionsByPlan[selectedPlanUsers?.key] || []}
          locale={{ emptyText: "No users have taken this plan yet." }}
          columns={[
            
            {
              title: <span className="text-[#9a2119] font-semibold">User</span>,
              dataIndex: "user",
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Email</span>,
              dataIndex: "email",
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Time</span>,
              dataIndex: "time",
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Status</span>,
              dataIndex: "status",
              render: (value) => (
                <Tag color={value === "Active" ? "red" : "default"}>{value}</Tag>
              ),
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Expiry Date</span>,
              dataIndex: "expiryDate",
            },
          ]}
        />
      </Modal>
    </>
  );
}
