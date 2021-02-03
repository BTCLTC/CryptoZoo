import React from 'react';
import { Select } from 'antd';
import { setLocale, getLocale } from 'umi';

const { Option } = Select;

export default function ChangeLocal() {
  const locale = getLocale() || 'zh-CN';
  const handleChange = (value: string) => {
    setLocale(value, false);
  }
  
  return (<Select defaultValue={locale} style={{ width: 120 }} onChange={handleChange}>
    <Option value="zh-CN">简体中文</Option>
    <Option value="en-US">English</Option>
  </Select>
  )
}