"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Package,
  Mail,
  Smile,
  Gift,
  Send,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/count", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load count");

        const data = await res.json();
        if (data.ok && typeof data.count === "number") {
          setCount(data.count);
        } else {
          setCount(209);
        }
      } catch {
        setCount(209);
      }
    };

    fetchCount();
  }, []);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const form = e.currentTarget;
      const hp =
        (form.querySelector('input[name="hp"]') as HTMLInputElement)?.value ||
        "";

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");

      // increment the persisted counter and reflect it in UI right away
      const incRes = await fetch("/api/count", {
        method: "POST",
        cache: "no-store",
      });
      const incJson = await incRes.json();

      if (incJson?.ok && typeof incJson.count === "number") {
        setCount(incJson.count);
      } else {
        // fallback: optimistic bump
        setCount((prev) => (typeof prev === "number" ? prev + 1 : 209));
      }

      setSubmitted(true);
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const features = [
    {
      icon: Heart,
      title: "Spread Love",
      description:
        "Send warmth and comfort to friends who need a hug, no matter the distance",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Sparkles,
      title: "Handpicked Cuties",
      description:
        "Every stuffed animal is carefully selected for maximum huggability",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Package,
      title: "Gift-Ready",
      description:
        "Arrives in beautiful packaging with your personalized message",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Smile,
      title: "Instant Joy",
      description: "Create unforgettable moments of surprise and happiness",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Choose Your Buddy",
      description:
        "Pick the perfect stuffed companion from our curated collection",
      icon: Gift,
    },
    {
      number: "2",
      title: "Personalize",
      description: "Add a heartfelt message and customizable options",
      icon: Mail,
    },
    {
      number: "3",
      title: "Send Love",
      description: "We'll deliver it right to their door with care",
      icon: Send,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-pink-50 to-purple-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse" />
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-130 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="text-center">
            <span className="inline-flex items-center mb-6 rounded-full bg-linear-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="w-4 h-4 mr-2" /> GiftAPlush is coming soon
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Send a Hug When{" "}
              <span className="block bg-linear-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Words Are not Enough
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The sweetest way to show you care. Send a cuddly companion to
              friends and loved ones — delivered with love and a personal touch.
            </p>
            {/* Mailchimp submit */}
            {!submitted ? (
              <form className="max-w-md mx-auto mb-8" onSubmit={handleSignup}>
                {/* hidden honeypot field */}
                <input
                  type="text"
                  name="hp"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="sm:flex-1 h-14 px-6 text-lg border-2 border-purple-200 focus:border-purple-400
                 placeholder:text-gray-700 text-gray-700 rounded-full outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 px-8 rounded-full font-semibold text-lg text-white
                 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600
                 hover:to-purple-700 shadow-lg transition-all"
                  >
                    {isSubmitting ? "Joining..." : "Notify Me"}
                  </button>
                </div>

                {errorMsg && (
                  <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
                )}
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-center gap-3 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <p className="text-lg font-semibold">
                    You are on the list! Thanks
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-12">
              🎉 Join {typeof count === "number" ? count : "…"} others waiting
              for launch
            </p>

            {/* Hero Image */}
            <div className="relative w-full">
              <div className="relative w-full h-80 sm:h-[380px] md:h-[480px] lg:h-[580px] scale-90 origin-center">
                {/* glow behind image */}
                <div className="absolute inset-0 bg-linear-to-r from-pink-400 to-purple-400 rounded-3xl blur-2xl opacity-30" />

                <Image
                  src="/kitten.png"
                  alt="Cute stuffed animals"
                  fill
                  sizes="(min-width:1024px) 70vw, (min-width: 768px) 80vw, 100vw"
                  className="relative rounded-3xl shadow-2xl object-cover border-8 border-white"
                  priority
                />

                {/* corner stat card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 bg-linear-to-br from-orange-400 to-pink-500 
                        rounded-xl flex items-center justify-center"
                    >
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">So many hugs</p>
                      <p className="text-sm text-gray-500">
                        Delivered with love
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Friends Love It
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just a gift — it’s a warm embrace to their doorstep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="border-2 border-gray-100 hover:border-purple-200 transition-transform hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur rounded-2xl p-6"
              >
                <div
                  className={`w-16 h-16 bg-linear-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 ">
              Simple as 1-2-3
            </h2>
            <p className="text-xl text-gray-600">
              Sending happiness has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-linear-to-r from-purple-300 to-pink-300" />
                )}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {s.number}
                      </span>
                    </div>
                    <s.icon className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GiftAPlush</span>
          </div>
          <p className="text-gray-600 mb-6">
            Spreading love, one plush at a time 💕
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GiftAPlush
          </p>
        </div>
      </footer>
    </div>
  );
}
