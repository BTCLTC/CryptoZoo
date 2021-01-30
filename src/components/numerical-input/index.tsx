import React from 'react';
import { Input } from 'antd';

function NumericInput(props) {
  const [innerValue, setInnerValue] = React.useState(props.initValue || '');

  const onChange = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setInnerValue(value);
      if (props.onChange) { props.onChange(value) };
    }
  };

  const onBlur = () => {
    const { onBlur, onChange } = props;
    let valueTemp = innerValue;
    if (innerValue && innerValue.charAt(innerValue.length - 1) === '.' || innerValue === '-') {
      valueTemp = innerValue.slice(0, -1);
    }

    const newVal = valueTemp.replace(/0*(\d+)/, '$1');
    setInnerValue(newVal);
    if (onChange) {
      onChange(newVal);
    }

    if (onBlur) {
      onBlur();
    }
  };

  return (
    <Input
      {...props}
      value={innerValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="请输入价格"
      suffix="ETH"
      maxLength={25}
    />
  );
}

export default NumericInput;
