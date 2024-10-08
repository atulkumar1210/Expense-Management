import React, { useState, useEffect } from 'react';
import { Form, Input, message, Modal, Select, Table, DatePicker } from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from '../components/Layout/Layout';
import axios from "axios";
import Spinner from "../components/Spinner";
import Analytics from "../components/Analytics";
import moment from 'moment';
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'refrence'
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} />
          <DeleteOutlined className='mx-2' onClick={() => { handleDelete(record) }} />
        </div>
      )
    },
  ];

  // Fetch all transactions
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      const res = await axios.post('/api/v1/transections/get-transection', { userid: user._id, frequency, selectedDate, type });
      setAllTransection(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Fetch issue with Transaction');
    }
  };

  // useEffect Hook to call getAllTransactions on dependency changes
  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  // Delete transaction and refresh data
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/transections/delete-transection", { transacationId: record._id });
      setLoading(false);
      message.success('Transaction Deleted');
      getAllTransactions(); // Refresh after delete
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Unable to delete');
    }
  };

  // Add/Edit transaction and refresh data
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post('/api/v1/transections/edit-transection', { payload: { ...values, userId: user._id }, transacationId: editable._id });
        message.success('Transaction edited successfully');
      } else {
        await axios.post('/api/v1/transections/add-transection', { ...values, userid: user._id });
        message.success('Transaction added successfully');
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
      getAllTransactions(); // Refresh after add/edit
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Failed to add transaction');
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='7'>LAST 1 week</Select.Option>
            <Select.Option value='30'>LAST 1 month</Select.Option>
            <Select.Option value='365'>LAST 1 year</Select.Option>
            <Select.Option value='custom'>custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedate(values)} />}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value='all'>ALL</Select.Option>
            <Select.Option value='income'>INCOME</Select.Option>
            <Select.Option value='expense'>EXPENSE</Select.Option>
          </Select>
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('table')} />
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('analytics')} />
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New</button>
        </div>
      </div>
      <div className='content'>
        {viewData === 'table' ? (
          <div className='tabul'>
            <Table columns={columns} dataSource={allTransection} />
          </div>
        ) : (
          <Analytics allTransection={allTransection} />
        )}
      </div>
      <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'} open={showModal} onCancel={() => setShowModal(false)} footer={false}>
        <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label='Amount' name='amount'>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Type' name='type'>
            <Select>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Category' name='category'>
            <Select>
              <Select.Option value='salary'>Salary</Select.Option>
              <Select.Option value='tip'>Tip</Select.Option>
              <Select.Option value='project'>Project</Select.Option>
              <Select.Option value='food'>Food</Select.Option>
              <Select.Option value='movie'>Movie</Select.Option>
              <Select.Option value='bills'>Bills</Select.Option>
              <Select.Option value='medical'>Medical</Select.Option>
              <Select.Option value='fee'>Fee</Select.Option>
              <Select.Option value='tax'>Tax</Select.Option>
              <Select.Option value='other'>Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Date' name='date'>
            <Input type='date' />
          </Form.Item>
          <Form.Item label='Reference' name='refrence'>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <Input type='text' />
          </Form.Item>
          <div className='d-flex justify-content-end'>
            <button className='btn btn-primary'>SUBMIT</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
