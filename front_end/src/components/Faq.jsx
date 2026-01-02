import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I contact support?",
    answer:
      "You can start a live chat with our support team by clicking the 'Start a Chat' button.",
  },
  {
    question: "How do I schedule a call?",
    answer:
      "Click the 'Book Call' button to schedule a call with your investment advisor.",
  },
  {
    question: "What are your support hours?",
    answer:
      "Our support team is available Monday through Friday, 9 AM to 6 PM EST.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <article className="mt-6">
      <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4"
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between font-medium text-left"
            >
              {faq.question}
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

export default Faq;
