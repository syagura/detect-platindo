import React from 'react'
import { Camera, Github, Heart, Linkedin, Instagram } from 'lucide-react'
import { SOCIAL_LINKS, QUICK_LINKS } from '../../config/constant'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            name: 'GitHub',
            icon: Github,
            url: SOCIAL_LINKS.GITHUB,
            color: 'hover:text-gray-300'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: SOCIAL_LINKS.LINKEDIN,
            color: 'hover:text-blue4'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: SOCIAL_LINKS.INSTAGRAM,
            color: 'hover:text-pink4'
        }
    ]

    return (
        <footer className="relative bg-dark">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink5/10 to-purple6/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5/10 to-blue4/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Camera className="w-6 h-6 text-blue4" />
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink5 to-purple6 bg-clip-text text-transparent">
                                DetectPlatIndo
                            </h3>
                        </div>
                        <p className="text-gray3 text-sm leading-relaxed max-w-sm">
                            A demo project showcasing AI-based Indonesian license plate detection,
                            built for experimentation, learning, and portfolio demonstration.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navigation</h4>
                        <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
                            {QUICK_LINKS.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.path}
                                        className="text-gray3 text-sm hover:text-pink5 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="md:justify-self-end">
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray3 ${social.color} transition-all hover:scale-110`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>


                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray3 text-sm">
                        © {currentYear} DetectPlatIndo
                    </p>

                    <div className="flex items-center gap-1 text-gray3 text-sm">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-pink5 fill-pink5" />
                        <span>in Indonesia</span>
                    </div>
                </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-pink5 via-purple6 to-blue5" />
        </footer>
    )
}

export default Footer






// import React from 'react';
// import { Camera, Github, Mail, Heart, Linkedin, Instagram } from 'lucide-react';
// import { SOCIAL_LINKS, QUICK_LINKS, RESOURCES } from '../../config/constant';

// /**
//  * Main Footer Component
//  */

// const Footer = () => {
//     const currentYear = new Date().getFullYear();

//     const socialLinks = [
//         {
//             name: 'GitHub',
//             icon: Github,
//             url: SOCIAL_LINKS.GITHUB,
//             color: 'hover:text-gray-300'
//         },
//         {
//             name: 'LinkedIn',
//             icon: Linkedin,
//             url: SOCIAL_LINKS.LINKEDIN,
//             color: 'hover:text-blue4'
//         },
//         {
//             name: 'Instagram',
//             icon: Instagram,
//             url: SOCIAL_LINKS.INSTAGRAM,
//             color: 'hover:text-pink4'
//         }
//     ];

//     return (
//         <footer className="relative bg-dark">
//             {/* Gradient Orbs Background */}
//             <div className="absolute inset-0 pointer-events-none overflow-hidden">
//                 <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink5/10 to-purple6/10 rounded-full blur-3xl" />
//                 <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5/10 to-blue4/10 rounded-full blur-3xl" />
//             </div>

//             <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//                     {/* Brand Section */}
//                     <div className="lg:col-span-1">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Camera className="w-6 h-6 text-blue4" />
//                             <h3 className="text-2xl font-bold bg-gradient-to-r from-pink5 to-purple6 bg-clip-text text-transparent">
//                                 DetectPlatIndo
//                             </h3>
//                         </div>
//                         <p className="text-gray3 text-sm leading-relaxed mb-4">
//                             AI-powered license plate detection system for Indonesian vehicles. Fast, accurate, and reliable.
//                         </p>
//                         <a
//                             href="mailto:contact@detectplatindo.com"
//                             className="flex items-center gap-2 text-gray3 text-sm hover:text-pink5 transition-colors"
//                         >
//                             <Mail className="w-4 h-4" />
//                             contact@detectplatindo.com
//                         </a>
//                     </div>

//                     {/* Quick Links */}
//                     <div>
//                         <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//                         <ul className="space-y-2">
//                             {QUICK_LINKS.map((link, index) => (
//                                 <li key={index}>
//                                     <a
//                                         href={link.path}
//                                         className="text-gray3 text-sm hover:text-pink5 transition-colors flex items-center gap-2 group"
//                                     >
//                                         <span className="w-1 h-1 bg-pink5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                                         {link.name}
//                                     </a>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Resources */}
//                     <div>
//                         <h4 className="text-white font-semibold mb-4">Resources</h4>
//                         <ul className="space-y-2">
//                             {RESOURCES.map((resource, index) => (
//                                 <li key={index}>
//                                 <a
//                                     href={resource.path}
//                                     className="text-gray3 text-sm hover:text-pink5 transition-colors flex items-center gap-2 group"
//                                 >
//                                     <span className="w-1 h-1 bg-pink5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                                     {resource.name}
//                                 </a>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Social & Newsletter */}
//                     <div>
//                         <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
//                         <div className="flex gap-3 mb-6">
//                             {socialLinks.map((social, index) => (
//                                 <a
//                                     key={index}
//                                     href={social.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className={`w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-gray3 ${social.color} transition-all hover:scale-110 hover:bg-white/10`}
//                                     aria-label={social.name}
//                                 >
//                                     <social.icon className="w-5 h-5" />
//                                 </a>
//                             ))}
//                         </div>

//                         {/* Newsletter Signup */}
//                         <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
//                             <p className="text-white text-sm font-semibold mb-2">Stay Updated</p>
//                             <p className="text-gray3 text-xs mb-3">Get notified about new features</p>
//                             <div className="flex gap-2">
//                                 <input
//                                     type="email"
//                                     placeholder="Your email"
//                                     className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pink5 focus:ring-1 focus:ring-pink5 transition-all"
//                                 />
//                                     <button className="bg-gradient-to-r from-purple6 to-pink6 hover:from-purple7 hover:to-pink7 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105">
//                                     Join
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom Bar */}
//                 <div className="pt-8 border-t border-white/10">
//                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                         <p className="text-gray3 text-sm text-center md:text-left">
//                             © {currentYear} DetectPlatIndo. All rights reserved.
//                         </p>

//                         <div className="flex items-center gap-1 text-gray3 text-sm">
//                             <span>Made with</span>
//                             <Heart className="w-4 h-4 text-pink5 fill-pink5 animate-pulse" />
//                             <span>in Indonesia</span>
//                         </div>

//                         <div className="flex gap-6 text-sm">
//                             <a href="/privacy" className="text-gray3 hover:text-pink5 transition-colors">
//                                 Privacy Policy
//                             </a>
//                             <a href="/terms" className="text-gray3 hover:text-pink5 transition-colors">
//                                 Terms of Service
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Decorative Bottom Line */}
//             <div className="h-1 bg-gradient-to-r from-pink5 via-purple6 to-blue5" />
//         </footer>
//   )
// }

// export default Footer
