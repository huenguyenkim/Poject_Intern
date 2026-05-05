import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Card, DatePicker, Form, Input, message, Modal, Progress, Select, Spin, Tag } from 'antd';
import { AlertTriangle, Activity, BarChart3, CalendarClock, CheckCircle2, Clock, Flame, Plus, Search, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useTasks, useUpdateTaskStatus } from '../../hooks/useTasks';
import { useSocket } from '../../context/SocketContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const statusColumns = [
  { key: 'todo', label: 'Todo', className: 'bg-slate-50' },
  { key: 'doing', label: 'Doing', className: 'bg-blue-50/60' },
  { key: 'done', label: 'Done', className: 'bg-emerald-50/60' },
];

const parseQuickTask = (text, staffList) => {
  const priorityMatch = text.match(/!(high|medium|low)\b/i);
  const assigneeMatch = text.match(/@([\p{L}\d._-]+)/iu);
  const tags = Array.from(text.matchAll(/#([\p{L}\d_-]+)/giu)).map((match) => match[1]);
  const assigneeToken = assigneeMatch?.[1]?.toLowerCase();
  const assignee = assigneeToken
    ? staffList.find((staff) => staff.fullName?.toLowerCase().includes(assigneeToken) || staff.email?.toLowerCase().includes(assigneeToken))
    : null;

  return {
    title: text
      .replace(/!(high|medium|low)\b/ig, '')
      .replace(/@[\p{L}\d._-]+/giu, '')
      .replace(/#[\p{L}\d_-]+/giu, '')
      .trim(),
    priority: priorityMatch?.[1]?.toLowerCase() || 'medium',
    assigneeId: assignee?.id,
    tags,
  };
};

const TaskDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => ({
    limit: 100,
    assigneeId: searchParams.get('assignee') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  }), [searchParams]);

  const { data: taskData, isLoading, isError } = useTasks(filters);
  const { mutate: updateTask, isPending } = useUpdateTaskStatus();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);
  const [staffList, setStaffList] = useState([]);
  const [quickTitle, setQuickTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffList((res.data || []).filter((user) => user.role === 'staff'));
      } catch (err) {
        console.error('Could not fetch staff', err);
      }
    };
    if (token) fetchStaff();
  }, [token]);

  useEffect(() => {
    if (!socket) return undefined;
    socket.emit('joinAdminDashboard');
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });
    ['taskCreated', 'taskUpdated', 'taskDeleted', 'taskActivity', 'taskAlert'].forEach((event) => socket.on(event, invalidate));
    return () => ['taskCreated', 'taskUpdated', 'taskDeleted', 'taskActivity', 'taskAlert'].forEach((event) => socket.off(event, invalidate));
  }, [socket, queryClient]);

  const tasks = taskData?.data || [];
  const stats = taskData?.stats || { todo: 0, doing: 0, done: 0, total: 0, overdue: 0, high: 0, completionRate: 0 };
  const alerts = taskData?.alerts || [];
  const timeline = taskData?.timeline || [];
  const workload = taskData?.workload || [];
  const activities = taskData?.activities || [];

  const updateUrlFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const normalized = Array.isArray(value) ? value.join(',') : value;
    if (normalized) next.set(key, normalized);
    else next.delete(key);
    setSearchParams(next);
  };

  const createTask = async (values) => {
    const payload = {
      ...values,
      deadline: values.deadline?.toISOString?.(),
      startDate: values.startDate?.toISOString?.(),
      difficulty: Number(values.difficulty || 1),
    };
    await axios.post(`${API_URL}/api/tasks`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const handleQuickAdd = () => {
    setIsModalVisible(true);
  };

  const handleFullCreate = async (values) => {
    try {
      await createTask(values);
      form.resetFields();
      setIsModalVisible(false);
      message.success('Task created successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Could not create task');
    }
  };

  const handleDrop = (event, newStatus) => {
    const taskId = event.dataTransfer.getData('taskId');
    updateTask({ id: taskId, status: newStatus });
  };

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spin size="large" /></div>;
  if (isError) return <div className="p-8 text-center font-bold text-red-500">Could not load tasks.</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Admin Operations</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">Task Dashboard</h1>
          <p className="mt-1 text-sm font-bold text-gray-500">KPI, alerts, timeline conflicts, workload and realtime activity in one workspace.</p>
        </div>

        <div className="flex min-w-[200px] justify-end gap-3">
          <Button type="primary" icon={<Plus size={16} />} className="h-12 rounded-2xl font-black px-8" onClick={handleQuickAdd}>
            Quick Add
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Completion', value: `${stats.completionRate}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'High Priority', value: stats.high, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Total Tasks', value: stats.total, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="rounded-3xl border-none shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{item.value}</p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${item.bg} ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {alerts.length > 0 && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-red-700">
            <AlertTriangle size={18} /> Smart Alerts
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {alerts.map((task) => (
              <div key={task.id} className="rounded-2xl bg-white p-4 text-sm font-bold text-red-700">
                {task.title} is due {format(new Date(task.deadline), 'HH:mm dd/MM')}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
        <Select allowClear placeholder="Assignee" value={filters.assigneeId} className="min-w-[180px]" onChange={(value) => updateUrlFilter('assignee', value)}>
          {staffList.map((staff) => <Select.Option key={staff.id} value={String(staff.id)}>{staff.fullName}</Select.Option>)}
        </Select>
        <Select allowClear placeholder="Status" value={filters.status} className="min-w-[140px]" onChange={(value) => updateUrlFilter('status', value)}>
          {statusColumns.map((status) => <Select.Option key={status.key} value={status.key}>{status.label}</Select.Option>)}
        </Select>
        <Select mode="multiple" placeholder="Priority" value={filters.priority} className="min-w-[220px]" onChange={(value) => updateUrlFilter('priority', value)}>
          {['high', 'medium', 'low'].map((priority) => <Select.Option key={priority} value={priority}>{priority}</Select.Option>)}
        </Select>
        <Select mode="tags" placeholder="Tags" value={filters.tags} className="min-w-[220px]" onChange={(value) => updateUrlFilter('tags', value)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="flex gap-5 overflow-x-auto pb-2">
          {statusColumns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.key);
            return (
              <div key={column.key} className={`min-w-[300px] flex-1 rounded-3xl p-4 ${column.className}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, column.key)}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">{column.label}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-500">{columnTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData('taskId', task.id)} className={`rounded-2xl bg-white p-4 shadow-sm ${task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done' ? 'ring-2 ring-red-200' : ''}`}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'} className="rounded-full border-0 font-black">{task.priority}</Tag>
                        <span className="text-[10px] font-black uppercase text-gray-400">{task.difficulty || 1} pts</span>
                      </div>
                      <h4 className="truncate text-sm font-black text-gray-900" title={task.title}>{task.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs font-bold text-gray-500">{task.description || 'No description'}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                          <Clock size={13} /> {task.deadline ? format(new Date(task.deadline), 'dd/MM') : 'No deadline'}
                        </span>
                        <Avatar size="small" className={task.assigneeId ? 'bg-primary' : 'bg-gray-300'}>{task.assignee?.fullName?.[0] || '?'}</Avatar>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-none shadow-sm" title={<span className="font-black">Team Workload</span>}>
            <div className="space-y-4">
              {workload.map((item) => (
                <div key={item.userId}>
                  <div className="mb-1 flex justify-between text-xs font-black">
                    <span>{item.fullName}</span>
                    <span className={item.overloaded ? 'text-red-600' : 'text-gray-500'}>{item.totalPoints}/40 pts</span>
                  </div>
                  <Progress percent={Math.min(100, Math.round((item.totalPoints / 40) * 100))} showInfo={false} strokeColor={item.overloaded ? '#ef4444' : '#e040a0'} />
                </div>
              ))}
              {workload.length === 0 && <p className="text-sm font-bold text-gray-400">No staff accounts found.</p>}
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm" title={<span className="font-black">Activity Feed</span>}>
            <div className="max-h-[340px] space-y-3 overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-black text-gray-800">{activity.message}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{format(new Date(activity.createdAt), 'HH:mm dd/MM')}</p>
                </div>
              ))}
              {activities.length === 0 && <p className="text-sm font-bold text-gray-400">No activity yet.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card className="rounded-3xl border-none shadow-sm" title={<span className="flex items-center gap-2 font-black"><CalendarClock size={18} /> Timeline & Overlap Detection</span>}>
        <div className="space-y-3">
          {timeline.slice(0, 12).map((task) => (
            <div key={task.id} className={`grid grid-cols-[180px_1fr_120px] items-center gap-4 rounded-2xl p-3 ${task.hasOverlap ? 'bg-red-50 text-red-700' : 'bg-slate-50'}`}>
              <span className="truncate text-xs font-black">{task.assignee?.fullName || 'Unassigned'}</span>
              <div className="h-4 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${task.hasOverlap ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, Math.max(12, (task.difficulty || 1) * 12))}%` }} />
              </div>
              <DatePicker
                size="small"
                className="rounded-xl"
                onChange={(value) => value && updateTask({ id: task.id, deadline: value.toISOString() })}
                placeholder={task.deadline ? format(new Date(task.deadline), 'dd/MM') : 'Extend'}
                disabled={isPending}
              />
            </div>
          ))}
        </div>
      </Card>

      <Modal title="Create Task" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={handleFullCreate} initialValues={{ priority: 'medium', status: 'todo', difficulty: 1 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="priority" label="Priority"><Select options={['low', 'medium', 'high'].map((value) => ({ value, label: value }))} /></Form.Item>
            <Form.Item name="difficulty" label="Difficulty"><Input type="number" min={1} /></Form.Item>
            <Form.Item name="startDate" label="Start"><DatePicker className="w-full" /></Form.Item>
            <Form.Item name="deadline" label="Deadline"><DatePicker className="w-full" /></Form.Item>
          </div>
          <Form.Item name="assigneeId" label="Assignee">
            <Select allowClear options={staffList.map((staff) => ({ value: staff.id, label: `${staff.fullName} (${staff.email})` }))} />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block className="h-12 rounded-2xl font-black">Create</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskDashboard;
