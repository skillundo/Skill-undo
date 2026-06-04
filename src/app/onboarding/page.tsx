"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { mockFirestore } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X } from "lucide-react";

export default function OnboardingPage() {
  const { user, checkProfileCompleteness } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState(user?.displayName || "");
  const [username, setUsername] = useState("");
  
  const [skills, setSkills] = useState<{name: string, level: string}[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  
  const [isSeller, setIsSeller] = useState(false);
  const [portfolio, setPortfolio] = useState("");
  const [hours, setHours] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, { name: currentSkill.trim(), level: currentLevel }]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      await mockFirestore.saveUserProfile(user.uid, {
        username,
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        skills: skills.map(s => s.name),
        rating: 0,
        completedJobs: 0,
        college: "Not specified",
        locality: "Not specified",
        portfolio: isSeller && portfolio ? [portfolio] : [],
      });
      
      await checkProfileCompleteness(user.uid);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-xl p-8 space-y-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl shadow-sm">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Complete your profile</h1>
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Full Name</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Username</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe123" 
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!name.trim() || !username.trim()}
              className="mt-6 w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Add your skills</label>
              <div className="flex gap-2">
                <Input 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="e.g. Graphic Design" 
                  className="flex-1"
                />
                <select 
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Professional">Professional</option>
                </select>
                <button 
                  onClick={handleAddSkill}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-10 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground border-l border-black/20 dark:border-white/20 pl-2">{skill.level}</span>
                  <button onClick={() => handleRemoveSkill(index)} className="ml-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setStep(1)}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 py-2"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={skills.length === 0}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="isSeller" 
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isSeller" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I want to offer services/gigs
              </label>
            </div>

            {isSeller && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Portfolio Link</label>
                  <Input 
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://my-portfolio.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Available Hours</label>
                  <Input 
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. 10hr/week, Evenings" 
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 py-2"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Setup"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
