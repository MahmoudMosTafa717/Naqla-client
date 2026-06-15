import { MapPin, Mail, Phone, ExternalLink, Code2, Globe } from "lucide-react";
import { AIScoreCircular } from "../ui/AIScoreBadge";
import AvatarUpload from "./AvatarUpload";

export default function ProfileSidebar({ profile, completion, onAvatarChange, onError }) {
  const basic = profile?.basicInfo ?? {};
  const location = basic.location ?? {};
  const social = basic.socialLinks ?? {};

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-center animate-slide-up">
        <AvatarUpload
          profile={profile}
          onAvatarChange={onAvatarChange}
          onError={onError}
        />
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {(location.city || location.country) && (
            <p className="flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-500" />
              {[location.city, location.country].filter(Boolean).join(", ")}
            </p>
          )}
          {profile?.email && (
            <p className="flex items-center justify-center gap-1.5">
              <Mail className="w-4 h-4 text-teal-500" />
              <span className="truncate">{profile.email}</span>
            </p>
          )}
          {basic.phone && (
            <p className="flex items-center justify-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-500" />
              {basic.phone}
            </p>
          )}
        </div>
      </div>

      {/* Profile Strength */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="font-semibold text-slate-800 mb-4">Profile Strength</h2>
        <div className="flex flex-col items-center gap-3">
          <AIScoreCircular score={completion} size={120} strokeWidth={8} label="Completion" />
          <p className="text-xs text-slate-500 text-center">
            Your profile is {completion}% complete. Add more details to improve visibility.
          </p>
        </div>
      </div>

      {/* Social Links */}
      {(social.linkedin || social.github || social.portfolio) && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-semibold text-slate-800 mb-4">Links</h2>
          <div className="space-y-3">
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline truncate"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span className="truncate">{social.linkedin.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-700 hover:underline truncate"
              >
                <Code2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{social.github.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {social.portfolio && (
              <a
                href={social.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-700 hover:underline truncate"
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span className="truncate">{social.portfolio.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
