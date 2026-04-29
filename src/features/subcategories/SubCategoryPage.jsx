import React, { useState } from "react";
import { Modal } from "antd";
import SubCategoryTable from "./SubCategoryTable";
import SubCategoryForm from "./SubCategoryForm";

const initialData = [
  {
    id: 1,
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    title: "MBBS",
    institutions: "AIIMS DELHI, AIIMS BHOPAL, AIIMS BHUBANESWAR, SCB Medical College, Maharaja Krushna Chandra Gajapati Medical College, Veer Surendra Sai Institute of Medical Sciences and Research, Saheed laxman nayak medical college and hospital, Post Graduate Institute of Medical &amp; Research (PGIMER), Chandigarh, Jawaharlal Institute of Postgraduate Medical Education &amp; Research (JIPMER), Puducherry, National Institute of Mental Health and Neuro Sciences, Kalinga Institute of Medical Sciences, Hi-Tech Medical College &amp; Hospital, Siksha ‘O’ Anusandhan (SUM Hospital), CMC, Vellore, KMC, Manipal, Amrita Vishwam Vidyapeetham",
    description: "The MBBS (Bachelor of Medicine and Bachelor of Surgery) is the core undergraduate degree for aspiring doctors in India. It spans 5.5 years - 4.5 years of academic study followed by a one-year compulsory rotating internship. The course offers comprehensive training in medical disciplines including anatomy, physiology, pharmacology, pathology, surgery, and clinical medicine, ensuring both theoretical knowledge and hands-on clinical experience. An MBBS degree enables graduates to practice as general physicians, pursue postgraduate specializations (MD/MS), or move into fields such as medical research, public health, and healthcare administration. It remains one of the most respected and demanding professional courses, marked by rigorous study and a strong commitment to human service.",
  },
  {
    id: 2,
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    title: "BDS",
    institutions: "Saveetha institute of medical and technical sciences, Manipal College of Dental Sciences, Maulana Azad Institute Of Dental Sciences (MAIDS), King George&#039;s Medical University, Dr. D. Y. Patil Vidyapeeth, Pimpri, Pune, SCB Dental College, Cuttack, Hi-Tech Dental College &amp; Hospital, Institute of Dental Sciences, Kalinga Institute of Dental Sciences (KIDS)",
    description: "The BDS (Bachelor of Dental Surgery) is the primary undergraduate degree for aspiring dental professionals in India. It spans 5 years, including 4 years of academic study and 1 year of compulsory internship, with comprehensive training in dental sciences and clinical practice. Students learn different specializations like dental anatomy, oral pathology, prosthodontics, periodontics, orthodontics, and oral surgery. A BDS degree allows graduates to practice as dental surgeons, pursue MDS (Master of Dental Surgery) for specialization, or explore fields such as dental research, public health, and academia. It is considered a prestigious and demanding course, blending scientific expertise with dedicated patient care in oral health.",
  },
];

function SubCategoryPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [search, setSearch] = useState("");

  const handleSubmit = (values) => {
    if (editData) {
      setData(data.map((d) => (d.id === editData.id ? { ...d, ...values } : d)));
    } else {
      setData([...data, { ...values, id: Date.now() }]);
    }
    setOpen(false);
    setEditData(null);
    setViewMode(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((d) => d.id !== id));
  };

  return (
    <div className="w-full"> {/* ✅ FIXED ALIGNMENT */}

      {/* Page Title */}
      <h2 className="text-xl font-semibold text-[#9a2119] mb-5">
        SubCategory Management
      </h2>

      {/* Table Section */}
      <div className="w-full">
        <SubCategoryTable
          data={data}
          search={search}
          setSearch={setSearch}
          onAdd={() => {
            setEditData(null);
            setViewMode(false);
            setOpen(true);
          }}
          onView={(row) => {
            setEditData(row);
            setViewMode(true);
            setOpen(true);
          }}
          onEdit={(row) => {
            setEditData(row);
            setViewMode(false);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
        title={
          viewMode
            ? "View SubCategory"
            : editData
            ? "Edit SubCategory"
            : "Add SubCategory"
        }
      >
        <SubCategoryForm
          onSubmit={handleSubmit}
          initialValues={editData}
          viewMode={viewMode}
        />
      </Modal>
    </div>
  );
}

export default SubCategoryPage;