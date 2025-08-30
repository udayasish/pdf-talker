"use client";
import React from "react";
import { GlareCard } from "@/app/components/ui/glare-card";
import { motion } from "motion/react";
import { Footer } from "../Footer/Footer";

export function PricingSection() {
  const pricingPlans = [
    {
      name: "Free",
      price: "Free",
      period: "",
      description: "Everything you need to get started with PDF Talker",
      features: [
        "Unlimited PDFs",
        "Advanced AI responses",
        "Up to 50MB file size",
        "Email support",
        "Fast processing speed",
        "Document history",
        "Export conversations",
      ],
      buttonText: "Get Started",
      popular: true,
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For professionals and power users",
      features: [
        "Unlimited PDFs",
        "Advanced AI responses",
        "Up to 50MB file size",
        "Priority support",
        "Fast processing speed",
        "Document history",
        "Export conversations",
      ],
      buttonText: "Coming Soon",
      popular: false,
      comingSoon: true,
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Unlimited file size",
        "API access",
        "Custom integrations",
        "24/7 phone support",
        "Advanced analytics",
        "Custom branding",
      ],
      buttonText: "Coming Soon",
      popular: false,
      comingSoon: true,
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
    },
  ];

  return (
    // <div className="relative py-20 bg-black">
    <div className="relative py-4 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Start with our free plan that includes all the features you need.
            Premium plans coming soon with even more advanced capabilities.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                  Most Popular
                </div>
              )}
              {plan.comingSoon && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                  Coming Soon
                </div>
              )}

              <GlareCard
                className={`flex flex-col justify-between p-8 h-full ${
                  plan.popular ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                    {plan.icon}
                  </div>

                  {/* Plan Details */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-400 ml-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.comingSoon
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
                      : plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                      : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.buttonText}
                </button>
              </GlareCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">Need a custom solution?</p>
          <button className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-xl hover:border-purple-500 hover:text-purple-400 transition-all duration-300">
            Contact Us
          </button>
        </motion.div>
      </div>
      <div className="pt-16">
        <Footer />
      </div>
    </div>
  );
}
