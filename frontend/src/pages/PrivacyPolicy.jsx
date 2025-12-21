import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="container-custom py-10">
            <div className="relative flex items-center justify-center mb-12">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 hover:opacity-80 transition-opacity"
                >
                    <img
                        src={backIcon}
                        alt="Back"
                        className="w-8 h-8 object-contain"
                        style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                    />
                </button>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-header-bg text-center">
                    Privacy Policy
                </h1>
            </div>
            <div className="space-y-6 text-text-main font-sans text-justify">
                <section>
                    <p className="mb-4">
                        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from 5 Stars Bakery.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif mb-4">Personal Information We Collect</h2>
                    <p className="mb-4">
                        When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone,
                        and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products
                        that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected
                        information as “Device Information”.
                    </p>
                    <p className="mb-4">
                        We collect Device Information using the following technologies:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>“Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier.</li>
                        <li>“Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
                        <li>“Web beacons”, “tags”, and “pixels” are electronic files used to record information about how you browse the Site.</li>
                    </ul>
                    <p>
                        Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address,
                        delivery address, payment information (including credit card numbers), email address, and phone number. We refer to this information as “Order Information”.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif mb-4">How Do We Use Your Personal Information?</h2>
                    <p className="mb-4">
                        We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for delivery,
                        and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Communicate with you;</li>
                        <li>Screen our orders for potential risk or fraud; and</li>
                        <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
                    <p>
                        You have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.
                        If you would like to exercise this right, please contact us through the contact information below.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif mb-4">Data Retention</h2>
                    <p>
                        When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
                    <p>
                        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at contact@5starsbakery.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
