import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Switch, Table, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import phyjson from "../../utils/phyjson";
import { getAssessmentSections } from "../../api/sectionsApi";
import { createQuestion, deleteQuestion, getQuestions, updateQuestion } from "../../api/questionsApi";
import { validationRules } from "../../utils/formValidation";

const list = (value) => Array.isArray(value) ? value : value?.sections || value?.questions || value?.data || [];
const unique = (items) => [...new Set(items.filter(Boolean))];
const JSON_SECTION_BY_CODE = {
  riasec: "Interest (RIASEC)",
  ocean: "Personality (OCEAN)",
  vark: "Learning Style (VARK) — supplementary",
  learning_style: "Learning Style (VARK) — supplementary",
  schwartz: "Values (Schwartz)",
  goal_orientation: "Goal Orientation — supplementary",
  aptitude: "Aptitude",
};
const jsonSectionFor = (section) =>
  JSON_SECTION_BY_CODE[section?.code] ||
  phyjson.find((item) => item.section === section?.title || item.section === section?.name)?.section;

function QuestionForm({ form, initialValues, sections, disabled, onSubmit, onCancel }) {
  const responseType = Form.useWatch("responseType", form);
  const sectionId = Form.useWatch("sectionId", form);
  const facetName = Form.useWatch("facetName", form);
  const order = Form.useWatch("order", form);
  const section = sections.find((item) => String(item.id) === String(sectionId));
  const permittedSections = useMemo(
    () => sections.filter((item) => phyjson.some((row) => row.responseType === responseType && row.section === jsonSectionFor(item))),
    [responseType, sections]
  );
  const matchingJson = useMemo(() => phyjson.filter((item) => item.responseType === responseType && item.section === jsonSectionFor(section)), [responseType, section]);
  const facetNames = unique(matchingJson.map((item) => item.facetName));
  const facetCodes = unique(matchingJson.filter((item) => item.facetName === facetName).map((item) => item.facetCode));
  
  useEffect(() => {
    form.setFieldsValue(initialValues
      ? { ...initialValues, order: Number(initialValues.order ?? 1) }
      : { reverse: false, order: 1 });
  }, [form, initialValues]);
  const clear = (fields) => form.setFieldsValue(Object.fromEntries(fields.map((key) => [key, undefined])));

  return <Form form={form} layout="vertical" onFinish={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <Form.Item name="responseType" label="Response Type" rules={[validationRules.required("Response type")]}>
      <Select disabled={disabled} placeholder="Select response type" options={unique(phyjson.map((item) => item.responseType)).map((value) => ({ value, label: value }))} onChange={() => clear(["sectionId", "facetName", "facetCode"])} />
    </Form.Item>
    <Form.Item name="sectionId" label="Section" rules={[validationRules.required("Section")]}>
      <Select disabled={disabled || !responseType} placeholder="Select section" options={permittedSections.map((item) => ({ value: item.id, label: item.title || item.code }))} onChange={() => clear(["facetName", "facetCode"])} />
    </Form.Item>
    <Form.Item name="facetName" label="Facet Name" rules={[validationRules.required("Facet name")]}>
      <Select disabled={disabled || !sectionId || !matchingJson.length} placeholder="Select facet name" options={facetNames.map((value) => ({ value, label: value }))} onChange={() => clear(["facetCode"])} />
    </Form.Item>
    <Form.Item name="facetCode" label="Facet Code" rules={[validationRules.required("Facet code")]}>
      <Select disabled={disabled || !facetName} placeholder="Select facet code" options={facetCodes.map((value) => ({ value, label: value }))} />
    </Form.Item>
    <Form.Item
      name="text"
      label="Question"
      className="md:col-span-2"
      validateTrigger={["onChange", "onBlur"]}
      rules={[{
        validator: (_, value) => value?.trim()
          ? Promise.resolve()
          : Promise.reject(new Error("Question is required.")),
      }]}
    >
      <Input.TextArea
        disabled={disabled}
        rows={4}
        placeholder="Enter question"
        onChange={(event) => form.setFieldValue("text", event.target.value)}
      />
    </Form.Item>
    <Form.Item name="reverse" label="Reverse" valuePropName="checked"><Switch disabled={disabled} /></Form.Item>
    <Form.Item name="order" label="Order" rules={[validationRules.required("Order")]}> 
      <InputNumber
        disabled={disabled}
        className="w-full"
        min={1}
        value={order ?? initialValues?.order ?? 1}
        onChange={(value) => form.setFieldValue("order", value)}
      />
    </Form.Item>
    <div className="md:col-span-2 flex justify-end gap-2"><Button onClick={onCancel}>{disabled ? "Close" : "Cancel"}</Button>{!disabled && <Button htmlType="submit" type="primary" style={{ background: "#9a2119", borderColor: "#9a2119" }}>{initialValues ? "Update Question" : "Save Question"}</Button>}</div>
  </Form>;
}

export default function Question() {
  const [form] = Form.useForm();
  const [sections, setSections] = useState([]); const [questions, setQuestions] = useState([]); const [sectionId, setSectionId] = useState();
  const [loading, setLoading] = useState(false); const [search, setSearch] = useState(""); const [record, setRecord] = useState(null); const [mode, setMode] = useState("add"); const [open, setOpen] = useState(false);
  useEffect(() => { (async () => { try { const result = await getAssessmentSections(); setSections(list(result?.data)); } catch { message.error("Failed to load sections"); } })(); }, []);
  const load = async (id) => { if (!id) return setQuestions([]); try { setLoading(true); const result = await getQuestions(id); const section = sections.find((item) => String(item.id) === String(id)); setQuestions(list(result?.data).map((item) => ({ ...item, sectionId: id, responseType: item.type, facetCode: item.facet, facetName: phyjson.find((row) => row.responseType === item.type && row.section === jsonSectionFor(section) && row.facetCode === item.facet)?.facetName, reverse: Boolean(item.reverse) }))); } catch (error) { message.error(error?.response?.data?.message || "Failed to load questions"); } finally { setLoading(false); } };
  const close = () => { setOpen(false); setRecord(null); form.resetFields(); };
  const openForm = (nextMode, item = null) => {
    const normalizedItem = item ? { ...item, order: Number(item.order ?? 1) } : null;
    setMode(nextMode);
    setRecord(normalizedItem);
    form.resetFields();
    form.setFieldsValue(normalizedItem || { reverse: false, order: 1, sectionId });
    setOpen(true);
  };
  const save = async (values) => {
    const text = values.text?.trim();
    if (!text) return message.error("Question text is required");

    const payload = {
      text,
      type: values.responseType,
      facet: values.facetCode,
      reverse: Boolean(values.reverse),
      order: Number(values.order),
    };
    const targetId = values.sectionId;
    try { const result = record ? await updateQuestion(targetId, record.id, payload) : await createQuestion(targetId, payload); if (!result?.success) return message.error(result?.message || "Unable to save question"); message.success(record ? "Question updated" : "Question created"); close(); setSectionId(targetId); await load(targetId); } catch (error) { message.error(error?.response?.data?.message || "Unable to save question"); }
  };
  const remove = async (item) => { try { const result = await deleteQuestion(item.sectionId || sectionId, item.id); if (!result?.success) return message.error(result?.message || "Unable to delete question"); message.success("Question deleted"); await load(item.sectionId || sectionId); } catch (error) { message.error(error?.response?.data?.message || "Unable to delete question"); } };
  const data = questions.filter((item) => [item.text, item.type, item.facet].join(" ").toLowerCase().includes(search.toLowerCase()));
  const columns = [{ title: "#", render: (_, __, index) => index + 1, width: 60 }, { title: "Question", dataIndex: "text", ellipsis: true }, { title: "Response Type", dataIndex: "type", width: 130 }, { title: "Facet", dataIndex: "facet", width: 100 }, { title: "Reverse", dataIndex: "reverse", width: 90, render: (value) => value ? "Yes" : "No" }, { title: "Order", dataIndex: "order", width: 80 }, { title: "Actions", width: 150, render: (_, item) => <div className="flex gap-2"><Button className="border-[#9a2119] text-[#9a2119]" icon={<EyeOutlined />} onClick={() => openForm("view", item)} /><Button className="border-[#9a2119] text-[#9a2119]" icon={<EditOutlined />} onClick={() => openForm("edit", item)} /><Popconfirm title="Delete question?" onConfirm={() => remove(item)}><Button danger icon={<DeleteOutlined />} /></Popconfirm></div> }];
  const selectSection = (id) => {
    setSectionId(id);
    load(id);
  };

  return <div className="space-y-5"><h2 className="text-xl font-bold text-[#9a2119]">Psychometric Question Management</h2><div className="rounded-2xl border bg-white p-6 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-[#9a2119]">Questions</h2><div className="flex gap-3"><Button icon={<ReloadOutlined />} onClick={() => load(sectionId)}>Reset</Button><Button type="primary" icon={<PlusOutlined />} style={{ background: "#9a2119", borderColor: "#9a2119" }} onClick={() => openForm("add")}>Add Question</Button></div></div><div className="mb-4 flex flex-wrap gap-2">{sections.map((item) => { const active = String(sectionId) === String(item.id); return <Button key={item.id} onClick={() => selectSection(item.id)} style={active ? { background: "#9a2119", borderColor: "#9a2119", color: "#ffffff" } : undefined}>{item.title || item.code}</Button>; })}</div><div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2"><Select value={sectionId} placeholder="Select section to show questions" options={sections.map((item) => ({ value: item.id, label: item.title || item.code }))} onChange={selectSection} /><Input value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="Search questions" /></div><Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: "max-content" }} /></div><Modal open={open} onCancel={close} footer={null} width={850} destroyOnClose title={mode === "add" ? "Add Question" : mode === "edit" ? "Edit Question" : "View Question"}><QuestionForm form={form} initialValues={record} sections={sections} disabled={mode === "view"} onSubmit={save} onCancel={close} /></Modal></div>;
}
