import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

/**
 * QuestionItem: Tách biệt logic render của từng câu hỏi để tối ưu re-render (React.memo).
 * Sử dụng register từ react-hook-form để quản lý state tập trung.
 */
const QuestionItem = React.memo(({ question, register, errors }) => {
  const { id, text, type, options, required } = question;
  const fieldName = `question_${id}`;

  const renderInput = () => {
    switch (type) {
      case 'rating':
        return (
          <div className="flex gap-4 items-center">
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={val} className="cursor-pointer group">
                <input 
                  type="radio" 
                  value={val} 
                  {...register(fieldName, { required })} 
                  className="hidden" 
                />
                <Star 
                  size={32} 
                  className={`transition-all group-hover:scale-110 ${errors[fieldName] ? 'text-error/30' : 'text-on_surface_variant/20'}`}
                  fill="currentColor" 
                />
              </label>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-3">
            {options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register(fieldName, { required })} 
                    className="peer w-6 h-6 appearance-none border-2 border-surface_container rounded-full checked:border-primary transition-all"
                  />
                  <div className="absolute w-3 h-3 bg-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold text-on_surface_variant group-hover:text-primary transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  value={opt} 
                  {...register(`${fieldName}.${idx}`)} 
                  className="w-6 h-6 rounded-lg border-2 border-surface_container checked:bg-primary transition-all appearance-none checked:border-primary relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:opacity-0 checked:after:opacity-100"
                />
                <span className="font-bold text-on_surface_variant group-hover:text-primary transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );

      default: // TEXT
        return (
          <textarea 
            {...register(fieldName, { required })}
            placeholder="Chia sẻ ý kiến của bạn tại đây..."
            className="w-full bg-surface_container_low border-2 border-surface_container rounded-[24px] p-6 font-bold text-on_surface outline-none focus:border-primary transition-all min-h-[120px] placeholder:text-on_surface_variant/30"
          />
        );
    }
  };

  return (
    <div className={`p-8 bg-white rounded-[40px] border-2 transition-all ${errors[fieldName] ? 'border-error shadow-lg shadow-error/5' : 'border-surface_container shadow-xl shadow-primary/5'}`}>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-on_surface leading-tight max-w-[80%]">
          {text} {required && <span className="text-error ml-1">*</span>}
        </h3>
        <span className="bg-surface_container px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-on_surface_variant">
          Q{id}
        </span>
      </div>
      {renderInput()}
      {errors[fieldName] && (
        <p className="text-error text-xs font-black uppercase tracking-widest mt-4 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-error animate-pulse"></div>
          Vui lòng trả lời câu hỏi này
        </p>
      )}
    </div>
  );
});

const CustomerSurvey = () => {
  const navigate = useNavigate();
  const { lang = 'vi' } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // 1. Dynamic Loop: Fetch câu hỏi từ database
  const { data: questions, isLoading } = useQuery({
    queryKey: ['survey-questions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/surveys/questions');
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => axios.post('/api/surveys/submit', data),
    onSuccess: () => {
      showSuccessToast('Cảm ơn bạn đã đóng góp ý kiến cho CandyShop!');
      navigate(`/${lang}/shop`);
    },
    onError: () => showErrorToast('Gửi khảo sát thất bại. Vui lòng thử lại.')
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface_dim">
        <div className="animate-spin text-primary"><Loader2 size={48} /></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-surface_dim min-h-screen py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-xs uppercase tracking-widest">
              <Star size={14} fill="currentColor" />
              <span>Feedback Loop</span>
            </div>
            <h1 className="text-5xl font-black text-on_surface tracking-tight uppercase">Khảo sát <span className="text-primary">Kẹo Ngọt</span></h1>
            <p className="text-on_surface_variant font-bold text-lg">Ý kiến của bạn là nguyên liệu quan trọng nhất để tạo nên những mẻ kẹo hoàn hảo!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dynamic Rendering Loop */}
            {questions?.map((q) => (
              <QuestionItem 
                key={q.id} 
                question={q} 
                register={register} 
                errors={errors} 
              />
            ))}

            <div className="pt-8">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-6 text-xl bg-primary hover:bg-primary/90 shadow-2xl flex justify-center items-center gap-3 active:scale-[0.98] transition-all"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
                GỬI PHẢN HỒI NGAY
              </Button>
              <p className="text-center text-[10px] font-black text-on_surface_variant/40 uppercase tracking-[0.2em] mt-6">
                Your privacy is our priority. Feedback is encrypted and safe.
              </p>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default CustomerSurvey;
