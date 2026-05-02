import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { format } from 'date-fns';
import { ChevronRight, Calendar, User } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/seo/SEO';

const BlogList = () => {
    const { data: blogs, isLoading } = useBlogs();
    const { lang } = useParams();

    return (
        <PageTransition>
            <SEO title="Sweet Stories - Candy Blog" description="Latest news and stories from the candy world." />
            <div className="bg-surface_dim min-h-screen pb-24 pt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-black text-on_surface mb-4 tracking-tight">Sweet Stories</h1>
                        <p className="text-on_surface_variant text-xl font-medium max-w-2xl mx-auto">
                            Khám phá những câu chuyện ngọt ngào, bí quyết làm kẹo và tin tức mới nhất từ vương quốc kẹo ngọt.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs?.map((blog) => (
                                <Link 
                                    key={blog.id} 
                                    to={`/${lang}/blog/${blog.id}`}
                                    className="group flex flex-col bg-white rounded-[40px] overflow-hidden border border-surface_container hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img 
                                            src={blog.imageUrl || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=800'} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                                                {blog.category}
                                            </span>
                                            <span className="text-xs font-bold text-on_surface_variant/60 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {format(new Date(blog.createdAt), 'dd MMM yyyy')}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-on_surface mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        <p className="text-on_surface_variant font-medium line-clamp-3 mb-6">
                                            {blog.summary || blog.content.substring(0, 150) + '...'}
                                        </p>
                                        <div className="mt-auto pt-6 border-t border-surface_container flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                                                    {blog.author?.username?.[0].toUpperCase() || 'A'}
                                                </div>
                                                <span className="text-xs font-black text-on_surface">{blog.author?.username || 'Admin'}</span>
                                            </div>
                                            <ChevronRight className="text-primary transform group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default BlogList;
