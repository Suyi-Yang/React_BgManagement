import React, { useState } from 'react';
import { Form, Input } from 'antd';

const CustomizedForm = ({ onChange, fields }) => {
  return (
    <Form
      name="global_state"
      layout="inline"
      fields={fields}
      onFieldsChange={(_, allFields) => {
        onChange(allFields);
      }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Username is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

const Demo = () => {
  const [fields, setFields] = useState([
    {
      name: ['username'],
      value: 'Ant Design',
    },
  ]);
  /* const addText = ()=>{
    console.log('===');
    JSON.stringify(fields, null, 2)
    console.log(fields);
    console.log('oooooo');
  } */
  return (
    <>
      <CustomizedForm
        fields={fields}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
      <span>{fields[0].value}</span>
      {/* <pre className="language-bash">{addText()}</pre> */}
    </>
  );
};

export default Demo