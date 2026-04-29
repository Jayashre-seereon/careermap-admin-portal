import { useState } from "react";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import logoPreview from "../../assets/logo_white_small.png";

const { TextArea } = Input;

const BRAND = "#9a2119";

const keywordOptions = [
  "Career",
  "Psychometric Test",
  "counselling",
  "Best Counselling",
  "student counselling",
  "best counselling in odisha",
  "career guidance",
  "career counselling cell",
  "career options",
  "career map odisha",
  "one-to-one counselling",
  "personalized counselling",
  "parents counselling",
  "students counselling",
];

const defaultKeywords = [
  "Career",
  "Psychometric Test",
  "counselling",
  "Best Counselling",
  "student counselling",
  "best counselling in odisha",
  "career guidance",
  "career counselling cell",
  "career options",
  "career map odisha",
  "one-to-one counselling",
  "personalized counselling",
  "parents counselling",
  "students counselling",
];

export default function SeoPage() {
  const [imageUrl, setImageUrl] = useState(logoPreview);
  const [keywords, setKeywords] = useState(defaultKeywords);
  const [form] = Form.useForm();

  const uploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result || logoPreview);
      };
      reader.readAsDataURL(file);
      message.success("SEO image selected successfully.");
      return false;
    },
  };

  const handleSave = async () => {
    await form.validateFields();
    message.success("SEO settings saved successfully.");
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          metaDescription:
            "Career Map offers expert counselling and psychometric tests to help students in Odisha and India choose the right path and build future-ready careers.",
          socialTitle:
            "Career Map - Odisha's Leading Career Counselling & Guidance Platform",
          socialDescription:
            "Career Map is Odisha's No. 1 career counselling organization, guiding students with expert counselling, psychometric tests, and personalized career pathways.",
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-4">
              <img
                src={imageUrl}
                alt="SEO preview"
                className="h-[170px] w-full object-contain"
              />
            </div>

            <Upload {...uploadProps}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                className="mt-4 h-10 w-full border-0 text-lg font-semibold shadow-none"
                style={{ background: BRAND }}
              >
                Upload Image
              </Button>
            </Upload>

            <p className="mt-3 text-[15px] text-gray-600">
              Recomended size: 1180x600px.
            </p>
          </div>

          <div>
            <Form.Item
              label={
                <span className="text-[16px] font-semibold text-gray-800">
                  Meta Keywords <span className="text-red-500">*</span>
                  <span className="ml-3 font-normal text-gray-600">
                    Separate multiple keywords by <span style={{ color: BRAND }}>,</span>(comma) or <span style={{ color: BRAND }}>enter</span> key
                  </span>
                </span>
              }
              required
            >
              <Select
                mode="tags"
                value={keywords}
                onChange={setKeywords}
                tokenSeparators={[","]}
                options={keywordOptions.map((value) => ({ value, label: value }))}
                className="seo-keywords"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="metaDescription"
              label={<span className="text-[16px] font-semibold text-gray-800">Meta Description <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Meta description is required" }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="socialTitle"
              label={<span className="text-[16px] font-semibold text-gray-800">Social Title <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Social title is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="socialDescription"
              label={<span className="text-[16px] font-semibold text-gray-800">Social Description <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Social description is required" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={handleSave}
                className="h-10 min-w-[82px] border-0 px-6 text-base shadow-none"
                style={{ background: BRAND }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Form>

      <style jsx>{`
        :global(.seo-keywords .ant-select-selector) {
          min-height: 112px !important;
          align-items: flex-start !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          border-color: #d1d5db !important;
          box-shadow: none !important;
        }

        :global(.seo-keywords .ant-select-selection-overflow) {
          gap: 6px 0;
        }

        :global(.seo-keywords.ant-select-focused .ant-select-selector) {
          border-color: ${BRAND} !important;
          box-shadow: 0 0 0 2px rgba(154, 33, 25, 0.08) !important;
        }

        :global(.seo-keywords .ant-select-selection-item) {
          border-color: rgba(154, 33, 25, 0.18) !important;
          background: rgba(154, 33, 25, 0.06) !important;
          color: #9a2119 !important;
        }
      `}</style>
    </div>
  );
}
