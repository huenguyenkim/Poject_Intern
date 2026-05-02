import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogDetail, useRelatedBlogs } from '../../hooks/useBlogs';
import { format } from 'date-fns';
import { Calendar, User, Clock, ChevronLeft, ArrowRight } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/seo/SEO';
import Button from '../../components/ui/Button';

const BlogDetail = () => {
    const { id, lang } = useParams();
    const { data: blog, isLoading } = useBlogDetail(id);
    const { data: related } = useRelatedBlogs(id);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-surface_dim"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!blog) return <div className="min-h-screen flex flex-col items-center justify-center bg-surface_dim"><h1 className="text-4xl font-black mb-4">Post Not Found</h1><Link to={`/${lang}/blog`}><Button variant="primary">Back to Stories</Button></Link></div>;

    return (
        <PageTransition>
            <SEO title={blog.title} description={blog.summary || blog.content.substring(0, 160)} image={blog.imageUrl} />
            <article className="bg-surface_dim min-h-screen">
                {/* Hero Header */}
                <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <img 
                        src={blog.imageUrl || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=1600'} 
                        className="w-full h-full object-cover" 
                        alt={blog.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                        <div className="max-w-4xl mx-auto">
                            <Link to={`/${lang}/blog`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-black uppercase tracking-widest text-xs transition-colors">
                                <ChevronLeft size={16} /> Back to Sweet Stories
                            </Link>
                            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">{blog.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
                                        {blog.author?.username?.[0].toUpperCase() || 'A'}
                                    </div>
                                    <span className="font-bold">{blog.author?.username || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar size={18} />
                                    {format(new Date(blog.createdAt), 'dd MMMM yyyy')}
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    <Clock size={18} />
                                    5 min read
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 md:px-0 py-20">
                    <div className="prose prose-xl prose-pink max-w-none text-on_surface_variant font-medium leading-relaxed">
                        {blog.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-6">{paragraph}</p>
                        ))}
                    </div>

                    <div className="mt-20 pt-10 border-t border-surface_container">
                        <h3 className="text-3xl font-black text-on_surface mb-10 tracking-tight">Gợi ý ngọt ngào khác</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {related?.map(item => (
                                <Link key={item.id} to={`/${lang}/blog/${item.id}`} className="group block">
                                    <div className="aspect-video rounded-3xl overflow-hidden mb-4 border border-surface_container shadow-lg shadow-primary/5">
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                                    </div>
                                    <h4 className="font-black text-on_surface group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </PageTransition>
    );
};

export default BlogDetail;
