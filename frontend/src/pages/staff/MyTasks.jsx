import React, { useState, useEffect, useMemo } from 'react';
import { Card, Tag, Select, message, Spin } from 'antd';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useTasks, useUpdateTaskStatus } from '../../hooks/useTasks';
import { useSocket } from '../../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import PageTransition from '../../components/layout/PageTransition';

const { Option } = Select;

/**
 * TaskItem: Component con cho từng Task.
 * Áp dụng Conditional Rendering:
 * - Nếu trạng thái là 'done': Hiển thị dạng rút gọn (Collapsed).
 * - Nếu trạng thái khác: Hiển thị đầy đủ chi tiết.
 */
const TaskItem = React.memo(({ task, onStatusChange, isPending }) => {
    const isDone = task.status === 'done';
    const [isExpanded, setIsExpanded] = useState(!isDone);

    return (
        <Card 
            className={`mb-4 shadow-sm border rounded-3xl overflow-hidden transition-all duration-500
                ${isDone ? 'border-green-100 bg-green-50/20' : 
                  task.isOverdue ? 'border-red-200 bg-red-50/30' : 
                  task.status === 'doing' ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'}`} 
            bodyStyle={{ padding: '16px 20px' }}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div className="flex-1">
                        <h3 className={`font-black text-[16px] leading-tight pr-2 
                            ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}
                            ${task.isOverdue ? 'text-red-700' : ''}`}
                        >
                            {task.isOverdue && <span className="mr-2 text-red-600 animate-pulse">⚠️</span>}
                            {task.title}
                        </h3>
                        {!isExpanded && isDone && (
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">
                                Hoàn thành lúc {format(new Date(task.updatedAt || new Date()), 'HH:mm dd/MM')}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {task.isOverdue && <Tag color="error" className="rounded-full font-black text-[10px]">QUÁ HẠN</Tag>}
                    <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'} className="rounded-full mr-0 font-bold border-0 text-[10px] px-2 py-0.5">
                        {task.priority.toUpperCase()}
                    </Tag>
                </div>
            </div>

            {/* Conditional Content Loop Logic */}
            {isExpanded && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {task.description && (
                        <p className={`text-sm mb-5 leading-relaxed ${isDone ? 'text-gray-300' : 'text-gray-500'}`}>
                            {task.description}
                        </p>
                    )}
                    
                    <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-100/50">
                        <div className="flex items-center justify-between text-xs">
                            <div className={`flex items-center font-bold px-3 py-1.5 rounded-full 
                                ${task.isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                                <ClockCircleOutlined className="mr-1.5" />
                                {task.deadline ? format(new Date(task.deadline), 'dd/MM/yyyy') : 'Không có hạn'}
                            </div>
                            {task.orderUuid && (
                                <span className={`font-mono font-bold px-3 py-1.5 rounded-full 
                                    ${isDone ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                                    #{task.orderUuid.split('-')[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                        
                        <Select 
                            value={task.status} 
                            className="w-full mt-1"
                            size="large"
                            onChange={(val) => onStatusChange(task.id, val)}
                            disabled={isPending}
                            bordered={false}
                            style={{ 
                                backgroundColor: task.isOverdue ? '#fee2e2' : task.status === 'todo' ? '#fefce8' : task.status === 'doing' ? '#eff6ff' : '#ecfdf5',
                                borderRadius: '16px',
                                border: task.isOverdue ? '1px solid #fecaca' : 'none'
                            }}
                            dropdownStyle={{ borderRadius: '16px', padding: '8px' }}
                        >
                            <Option value="todo"><div className="flex items-center gap-2 font-bold text-gray-600"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> CHỜ XỬ LÝ</div></Option>
                            <Option value="doing"><div className="flex items-center gap-2 font-bold text-blue-600"><SyncOutlined spin={task.status==='doing'} /> ĐANG LÀM</div></Option>
                            <Option value="done"><div className="flex items-center gap-2 font-bold text-green-600"><CheckCircleOutlined /> HOÀN THÀNH</div></Option>
                        </Select>
                    </div>
                </div>
            )}
        </Card>
    );
});

const MyTasks = () => {
    const { data: taskData, isLoading, isError } = useTasks({ limit: 50 });
    const { mutate: updateStatus, isPending } = useUpdateTaskStatus();
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (socket) {
            socket.on('taskCreated', () => queryClient.invalidateQueries(['tasks']));
            socket.on('taskUpdated', () => queryClient.invalidateQueries(['tasks']));
            socket.on('taskDeleted', () => queryClient.invalidateQueries(['tasks']));
            return () => {
                socket.off('taskCreated');
                socket.off('taskUpdated');
                socket.off('taskDeleted');
            };
        }
    }, [socket, queryClient]);

    const handleStatusChange = (id, newStatus) => {
        updateStatus({ id, status: newStatus }, {
            onSuccess: () => message.success('Đã cập nhật trạng thái'),
            onError: () => message.error('Lỗi khi cập nhật')
        });
    };

    /**
     * Logic Tối ưu hóa: Sử dụng useMemo để phân loại dữ liệu.
     * Tránh tính toán trực tiếp trong hàm render.
     */
    const { todoTasks, doingTasks, doneTasks, overdueTasks } = useMemo(() => {
        const tasks = taskData?.data || [];
        const processed = tasks.map(t => ({
            ...t,
            isOverdue: t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
        }));

        return {
            todoTasks: processed.filter(t => t.status === 'todo' && !t.isOverdue),
            doingTasks: processed.filter(t => t.status === 'doing' && !t.isOverdue),
            doneTasks: processed.filter(t => t.status === 'done'),
            overdueTasks: processed.filter(t => t.isOverdue)
        };
    }, [taskData]);

    // Lấy Stats trực tiếp từ Metadata Backend (Tối ưu hóa performance)
    const stats = taskData?.stats || { todo: 0, doing: 0, done: 0 };

    if (isLoading) return <div className="h-[80vh] flex items-center justify-center bg-gray-50"><Spin size="large" /></div>;
    if (isError) return <div className="p-8 text-center text-red-500 font-bold bg-red-50 m-4 rounded-2xl">Lỗi kết nối mạng.</div>;

    return (
        <PageTransition>
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen pb-24">
                <div className="mb-10 mt-2 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Điều phối Kho hàng</h2>
                        <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-widest">Dữ liệu Real-time • {taskData?.total || 0} công việc</p>
                    </div>
                    <div className="flex -space-x-2">
                        {['todo', 'doing', 'done'].map(s => (
                            <div key={s} className={`w-10 h-10 rounded-full border-4 border-gray-50 flex items-center justify-center font-black text-xs text-white
                                ${s==='todo' ? 'bg-yellow-400' : s==='doing' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {stats[s] || 0}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Categorized Conditional Loops */}
                <div className="space-y-12">
                    {overdueTasks.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                                Quá hạn cần xử lý gấp ({overdueTasks.length})
                            </h3>
                            {overdueTasks.map(t => (
                                <TaskItem key={t.id} task={t} onStatusChange={handleStatusChange} isPending={isPending} />
                            ))}
                        </div>
                    )}

                    {doingTasks.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <SyncOutlined spin /> Đang thực hiện ({doingTasks.length})
                            </h3>
                            {doingTasks.map(t => (
                                <TaskItem key={t.id} task={t} onStatusChange={handleStatusChange} isPending={isPending} />
                            ))}
                        </div>
                    )}

                    {todoTasks.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-black text-yellow-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                                Chờ xử lý ({todoTasks.length})
                            </h3>
                            {todoTasks.map(t => (
                                <TaskItem key={t.id} task={t} onStatusChange={handleStatusChange} isPending={isPending} />
                            ))}
                        </div>
                    )}

                    {doneTasks.length > 0 && (
                        <div>
                            <h3 className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircleOutlined /> Đã hoàn thành ({doneTasks.length})
                            </h3>
                            {doneTasks.map(t => (
                                <TaskItem key={t.id} task={t} onStatusChange={handleStatusChange} isPending={isPending} />
                            ))}
                        </div>
                    )}

                    {taskData?.total === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm mb-6">
                                <CheckCircleOutlined className="text-6xl text-green-400" />
                            </div>
                            <p className="text-xl font-black text-gray-700">Tất cả đã xong!</p>
                            <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Thư giãn và thưởng thức kẹo thôi</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default MyTasks;
