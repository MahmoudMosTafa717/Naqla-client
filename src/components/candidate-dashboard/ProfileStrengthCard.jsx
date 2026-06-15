import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { AIScoreCircular } from "../ui/AIScoreBadge";

const CHECKS = [
  { key: "resume", done: "Resume uploaded", todo: "Upload your resume" },
  { key: "skills", done: "Skills added", todo: "Add your skills" },
  { key: "experience", done: "Work experience added", todo: "Add work experience" },
  { key: "education", done: "Education listed", todo: "Add education" },
  { key: "contactInfo", done: "Headline & Phone complete", todo: "Add headline & phone" },
  { key: "bio", done: "Personal bio written", todo: "Write a personal bio" },
];

export default function ProfileStrengthCard({ profileCompletion, profileChecks }) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Profile Strength</h3>
      </div>
      <CardContent className="flex flex-col items-center pt-8 bg-gradient-to-b from-white to-slate-50/50">
        <AIScoreCircular score={profileCompletion} size={140} strokeWidth={10} label="Completion" />
        <div className="mt-6 w-full space-y-3">
          {CHECKS.map(({ key, done, todo }) => (
            <div key={key} className="flex items-center gap-2.5 text-sm">
              {profileChecks[key] ? (
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
              )}
              <span className={profileChecks[key] ? "text-slate-700 font-medium" : "text-slate-400 font-medium"}>
                {profileChecks[key] ? done : todo}
              </span>
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate("/candidate/profile")}
        >
          Complete Profile
        </Button>
      </CardContent>
    </Card>
  );
}
