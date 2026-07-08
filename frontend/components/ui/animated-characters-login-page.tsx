"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const pupil = pupilRef.current.getBoundingClientRect();
    const deltaX = mouseX - (pupil.left + pupil.width / 2);
    const deltaY = mouseY - (pupil.top + pupil.height / 2);
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();
  return (
    <div ref={pupilRef} className="rounded-full" style={{ width: `${size}px`, height: `${size}px`, backgroundColor: pupilColor, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.1s ease-out" }} />
  );
};

interface EyeBallProps {
  size?: number; pupilSize?: number; maxDistance?: number;
  eyeColor?: string; pupilColor?: string; isBlinking?: boolean;
  forceLookX?: number; forceLookY?: number;
}

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const deltaX = mouseX - (eye.left + eye.width / 2);
    const deltaY = mouseY - (eye.top + eye.height / 2);
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();
  return (
    <div ref={eyeRef} className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{ width: `${size}px`, height: isBlinking ? "2px" : `${size}px`, backgroundColor: eyeColor, overflow: "hidden" }}>
      {!isBlinking && (
        <div className="rounded-full" style={{ width: `${pupilSize}px`, height: `${pupilSize}px`, backgroundColor: pupilColor, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.1s ease-out" }} />
      )}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random blinking for purple
  useEffect(() => {
    const scheduleBlink = (): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => { setIsPurpleBlinking(false); scheduleBlink(); }, 150);
      }, Math.random() * 4000 + 3000);
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Random blinking for black
  useEffect(() => {
    const scheduleBlink = (): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => { setIsBlackBlinking(false); scheduleBlink(); }, 150);
      }, Math.random() * 4000 + 3000);
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const deltaX = mouseX - (rect.left + rect.width / 2);
    const deltaY = mouseY - (rect.top + rect.height / 3);
    return {
      faceX: Math.max(-15, Math.min(15, deltaX / 20)),
      faceY: Math.max(-10, Math.min(10, deltaY / 30)),
      bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
    };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    // Demo credentials — replace with real auth
    if (email === "risikesh@gmail.com" && password === "1234") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Try: risikesh@gmail.com / 1234");
    }
    setIsLoading(false);
  };

  const passwordHiding = password.length > 0 && !showPassword;
  const passwordVisible = password.length > 0 && showPassword;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ───────── LEFT — Characters Panel ───────── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden" style={{ background: "#E8E8EE" }}>
        {/* Logo */}
        <div className="relative z-20 flex items-center gap-2 text-lg font-semibold text-[#1A1A2E]">
          <div className="size-8 rounded-lg bg-[#1A1A2E]/10 flex items-center justify-center">
            <Sparkles className="size-4 text-[#1A1A2E]" />
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Legacy OS</span>
        </div>

        {/* Characters Stage */}
        <div className="relative z-20 flex items-end justify-center" style={{ height: 440 }}>
          <div className="relative" style={{ width: 550, height: 420 }}>

            {/* Purple tall rectangle — back */}
            <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: 70, width: 180,
                height: passwordHiding ? 440 : 400,
                backgroundColor: "#6C3FF5",
                borderRadius: "10px 10px 0 0", zIndex: 1,
                transform: passwordVisible
                  ? "skewX(0deg)"
                  : passwordHiding
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}>
              <div className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: passwordVisible ? 20 : isLookingAtEachOther ? 55 : 45 + purplePos.faceX,
                  top: passwordVisible ? 35 : isLookingAtEachOther ? 65 : 40 + purplePos.faceY,
                }}>
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Black tall rectangle — middle */}
            <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: 240, width: 120, height: 310,
                backgroundColor: "#2D2D2D",
                borderRadius: "8px 8px 0 0", zIndex: 2,
                transform: passwordVisible ? "skewX(0deg)"
                  : isLookingAtEachOther ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : passwordHiding ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                  : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}>
              <div className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: passwordVisible ? 10 : isLookingAtEachOther ? 32 : 26 + blackPos.faceX,
                  top: passwordVisible ? 28 : isLookingAtEachOther ? 12 : 32 + blackPos.faceY,
                }}>
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange semi-circle — front left */}
            <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: 0, width: 240, height: 200,
                backgroundColor: "#FF9B6B",
                borderRadius: "120px 120px 0 0", zIndex: 3,
                transform: passwordVisible ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}>
              <div className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? 50 : 82 + (orangePos.faceX || 0),
                  top: passwordVisible ? 85 : 90 + (orangePos.faceY || 0),
                }}>
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow rounded rect — front right */}
            <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: 310, width: 140, height: 230,
                backgroundColor: "#E8D754",
                borderRadius: "70px 70px 0 0", zIndex: 4,
                transform: passwordVisible ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}>
              <div className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? 20 : 52 + (yellowPos.faceX || 0),
                  top: passwordVisible ? 35 : 40 + (yellowPos.faceY || 0),
                }}>
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
              </div>
              {/* Mouth */}
              <div className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? 10 : 40 + (yellowPos.faceX || 0),
                  top: passwordVisible ? 88 : 88 + (yellowPos.faceY || 0),
                }} />
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-20 flex items-center gap-8 text-sm text-[#6B7280]">
          <a href="#" className="hover:text-[#1A1A2E] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#1A1A2E] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#1A1A2E] transition-colors">Contact</a>
        </div>
      </div>

      {/* ───────── RIGHT — Login Form ───────── */}
      <div className="flex items-center justify-center p-8 bg-[#111111]">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12 text-white">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <span>Legacy OS</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Welcome back!</h1>
            <p className="text-[#9CA3AF] text-sm">Please enter your details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#D1D5DB]">Email</Label>
              <Input
                id="email" type="email" placeholder="risikesh@gmail.com" value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-12 bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#555] focus-visible:ring-violet-500 focus-visible:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#D1D5DB]">Password</Label>
              <div className="relative">
                <Input
                  id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="h-12 pr-10 bg-[#1E1E1E] border-[#333] text-white placeholder:text-[#555] focus-visible:ring-violet-500 focus-visible:border-violet-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-[#444] data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600" />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-[#9CA3AF]">
                  Remember for 30 days
                </Label>
              </div>
              <a href="#" className="text-sm text-violet-400 hover:text-violet-300 hover:underline font-medium">Forgot password?</a>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-full bg-white text-[#1A1A2E] font-semibold text-base hover:bg-gray-100 transition-colors disabled:opacity-60">
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          {/* Google */}
          <div className="mt-4">
            <button type="button"
              className="w-full h-12 rounded-full border border-[#333] bg-transparent text-white font-medium flex items-center justify-center gap-2 hover:bg-[#1E1E1E] transition-colors">
              <Mail className="size-5" /> Log in with Google
            </button>
          </div>

          {/* Sign Up */}
          <div className="text-center text-sm text-[#6B7280] mt-8">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-white font-semibold hover:underline">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
