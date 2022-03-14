import React from 'react';
import _ from 'lodash';
import { Table } from 'antd';
import { Range } from '@/components/DateRangePicker';
import usePrometheus from '../../datasource/usePrometheus';
import { IPanel } from '../../../types';
import { VariableType } from '../../../VariableConfig';
import getCalculatedValuesBySeries from '../../utils/getCalculatedValuesBySeries';
import './style.less';

interface IProps {
  time: Range;
  step: number | null;
  values: IPanel;
  variableConfig?: VariableType;
}

export default function Stat(props: IProps) {
  const { values, time, step, variableConfig } = props;
  const { targets, custom, options } = values;
  const { showHeader, calc, aggrOperator, aggrDimension } = custom;
  const { series } = usePrometheus({
    time,
    step,
    targets,
    variableConfig,
  });
  const calculatedValues = getCalculatedValuesBySeries(
    series,
    calc,
    {
      util: options?.standardOptions?.util,
      decimals: options?.standardOptions?.decimals,
    },
    aggrOperator,
    aggrDimension,
  );
  const firstItem = _.first(calculatedValues);
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div className='renderer-table-td-content'>{text}</div>,
    },
  ];

  if (aggrDimension) {
    _.map(firstItem?.groupNames, (name) => {
      columns.push({
        title: name,
        dataIndex: name,
        key: name,
        render: (text) => <div className='renderer-table-td-content'>{text}</div>,
      });
    });
  } else {
    columns.push({
      title: 'value',
      dataIndex: 'stat',
      key: 'stat',
      render: (text) => <div className='renderer-table-td-content'>{text}</div>,
    });
  }

  const height = showHeader ? 168 : 198;

  return (
    <div className='renderer-table-container'>
      <div className='renderer-table-container-box'>
        <Table rowKey='name' showHeader={showHeader} dataSource={calculatedValues} columns={columns} scroll={{ y: height }} bordered={false} pagination={false} />
      </div>
    </div>
  );
}