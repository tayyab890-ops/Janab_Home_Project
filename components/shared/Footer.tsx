import Link from "next/link";
import { Bike, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Logo & Info */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-primary p-2 rounded-lg">
                                <Bike className="text-white h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Janab <span className="text-secondary">Delivery</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Fastest and most reliable delivery service in KTS, Haripur and surrounding areas. We deliver anything, anytime.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
                            <li><Link href="/track" className="hover:text-secondary transition-colors">Track Order</Link></li>
                            <li><Link href="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link></li>
                            <li><Link href="/services" className="hover:text-secondary transition-colors">Our Services</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-secondary" />
                                <span>+92 300 0000000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-secondary" />
                                <span>support@janabdelivery.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-secondary" />
                                <span>Main KTS Road, Haripur</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Icons */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© 2024 Janab Home Delivery. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
