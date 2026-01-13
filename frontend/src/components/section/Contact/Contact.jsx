import React, {useState} from 'react';
import emailJS from "@emailjs/browser";
import { Mail, MessageSquare, Send, MapPin, Github, Linkedin, Instagram, CheckCircle, AlertCircle, Cast } from 'lucide-react';
import { SOCIAL_LINKS } from '../../../config/constant';

/**
 * Contact Section Component
 */

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setFormStatus('error');
            return;
        }

        setIsSubmitting(true);

        try {
            await emailJS.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setFormStatus('success');
            setFormData({name: '', email: '', subject: '', message: ''});

            setTimeout(() => setFormStatus(null), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setFormStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            value: SOCIAL_LINKS.email,
            link: SOCIAL_LINKS.emailto
        },
        {
            icon: MessageSquare,
            title: "Response Time",
            value: "Usually within 24 hours",
            link: null
        },
        {
            icon: MapPin,
            title: "Location",
            value: "Jakarta, Indonesia",
            link: null
        }
    ];

    const socialLinks = [
        {
            icon: Github,
            name: "Github",
            username: "@syagura",
            link: SOCIAL_LINKS.githubprofile,
            color: "hover:bg-gray-700"
        },
        {
            icon: Linkedin,
            name: "LinkedIn",
            username: "@syahrul",
            link: SOCIAL_LINKS.linkedin,
            color: "hover:bg-blue-600"
        },
        {
            icon: Instagram,
            name: "Instagram",
            username: "@syahrul",
            link: SOCIAL_LINKS.instagram,
            color: "hover:bg-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <div className="bg-dark backdrop-blur-xl border-b border-white/10">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink4/10 to-purple6/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5/10 to-blue4/10 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink6 to-purple6">
                            Get In Touch
                        </h1>
                        <p className="text-xl text-gray3 max-w-2xl mx-auto">
                            Have questions, suggestions, or want to collaborate? I'd love to hear from you!
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <Send className="w-8 h-8 text-purple6" />
                                Send Me a Message
                            </h2>

                            {formStatus === 'success' && (
                                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Message Sent Successfully!</h4>
                                        <p className="text-green-200 text-sm">Thanks for reaching out. I'll get back to you soon!</p>
                                    </div>
                                </div>
                            )}

                            {formStatus === 'error' && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Oops!</h4>
                                        <p className="text-red-200 text-sm">Please fill in all fields before submitting.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white font-medium mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple6 focus:ring-2 focus:ring-purple6/50 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-medium mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple6 focus:ring-2 focus:ring-purple6/50 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple6 focus:ring-2 focus:ring-purple6/50 transition-all"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple6 focus:ring-2 focus:ring-purple6/50 transition-all resize-none"
                                        placeholder="Tell me what's on your mind..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple6 to-pink6 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple7 hover:to-pink7 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info & Social Links */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="bg-gradient-to-br from-pink5 to-purple6 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <info.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-semibold mb-1">{info.title}</h4>
                                            {info.link ? (
                                                <a
                                                href={info.link}
                                                className="text-gray-300 hover:text-purple6 transition-colors break-all"
                                                >
                                                {info.value}
                                                </a>
                                            ) : (
                                                <p className="text-gray3">{info.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Connect With Me</h3>
                            <div className="space-y-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 ${social.color} transition-all group`}
                                    >
                                        <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <social.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{social.name}</h4>
                                            <p className="text-gray-400 text-sm">{social.username}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Note */}
                        <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-4">Quick Note</h3>
                            <p className="text-gray3 leading-relaxed">
                                I'm always open to discussing new projects, innovative ideas, or opportunities to collaborate.
                                Feel free to reach out anytime. You can also explore my full portfolio for detailed case studies and other projects.
                            </p>
                            <a 
                                href=""
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 text-purple6 font-semibold hover:underline'
                            >
                                View Full Portfolio →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 bg-gradient-to-r from-purple6 to-pink6 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Want to Contribute?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        DetectPlatIndo is open source! Check out the repository and feel free to contribute.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={SOCIAL_LINKS.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-purple6 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                        <a
                            href="/docs"
                            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            Read Documentation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
