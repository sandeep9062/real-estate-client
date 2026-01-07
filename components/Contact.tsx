"use client";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiChatBubbleBottomCenter } from "react-icons/hi2";
import Image from "next/image";

const Contact = () => {
  return (
    <section id="contact-us" className="py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <div className="flex flex-col gap-2">
            <span className="text-indigo-600 font-semibold uppercase tracking-wider">
              Our Contact Us
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Easy to Contact Us
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mt-2">
              We are always ready to help by providing the best services for
              you.
              <br />
              We believe a good place to live can make your life better.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <ContactMode
                icon={<MdCall size={25} />}
                title="Call"
                detail="9729907448"
                buttonLabel="Call Now"
              />
              <ContactMode
                icon={<BsFillChatDotsFill size={25} />}
                title="Chat"
                detail="9729907448"
                buttonLabel="Chat Now"
              />
              <ContactMode
                icon={<BsFillChatDotsFill size={25} />}
                title="Video Call"
                detail="9729907448"
                buttonLabel="Video Call Now"
              />
              <ContactMode
                icon={<HiChatBubbleBottomCenter size={25} />}
                title="Message"
                detail="9729907448"
                buttonLabel="Message Now"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center md:justify-end">
            <div className=" border-8 border-gray-200 rounded-lg overflow-hidden shadow-lg  w-full max-w-md">
              <Image
                src="/contact-image3.png"
                alt="Contact us illustration"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

interface ModeProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  buttonLabel: string;
}

const ContactMode = ({ icon, title, detail, buttonLabel }: ModeProps) => {
  const handleContactAction = () => {
    const phoneNumber = "9729907448";

    switch (title) {
      case "Call":
        window.location.href = `tel:${phoneNumber}`;
        break;
      case "Chat":
        const message = encodeURIComponent("Hi, I'm interested in your real estate services and would like to know more about available properties.");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        break;
      case "Video Call":
        window.open(`https://meet.google.com/`, "_blank");
        break;
      case "Message":
        const smsMessage = encodeURIComponent("Hi, I'm interested in your real estate services and would like to know more about available properties.");
        window.location.href = `sms:${phoneNumber}?body=${smsMessage}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-5 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-indigo-100 text-[#4161df] rounded-lg">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">{title}</span>
          <span className="text-gray-500">{detail}</span>
        </div>
      </div>
      <button
        onClick={handleContactAction}
        className="w-full bg-[#4161df] hover:bg-[#3759dd] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
      >
        {buttonLabel}
      </button>
    </div>
  );
};
