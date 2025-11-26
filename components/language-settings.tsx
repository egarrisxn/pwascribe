"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LanguageSettingsProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  onClose: () => void;
}

const AVAILABLE_LANGUAGES = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "hi-IN", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "es-ES", name: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
];

export default function LanguageSettings({
  selectedLanguages,
  onLanguagesChange,
  onClose,
}: LanguageSettingsProps) {
  const toggleLanguage = (code: string) => {
    if (selectedLanguages.includes(code)) {
      // Keep at least one language selected
      if (selectedLanguages.length > 1) {
        onLanguagesChange(selectedLanguages.filter((l) => l !== code));
      }
    } else {
      onLanguagesChange([code, ...selectedLanguages]);
    }
  };

  return (
    <div className='border-b border-border bg-card'>
      <div className='container mx-auto p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-foreground'>
            Language Settings
          </h2>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='size-5' />
          </Button>
        </div>

        <div className='space-y-2'>
          <p className='mb-3 text-muted-foreground'>
            Primary language for recognition (first selected):
          </p>

          <div className='grid grid-cols-1 gap-2'>
            {AVAILABLE_LANGUAGES.map((lang) => (
              <Card
                key={lang.code}
                className={`cursor-pointer p-3 transition-all ${
                  selectedLanguages.includes(lang.code)
                    ? "border-accent bg-accent/10"
                    : "bg-card hover:bg-muted/50"
                }`}
                onClick={() => toggleLanguage(lang.code)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>{lang.flag}</span>
                    <span className='font-medium text-card-foreground'>
                      {lang.name}
                    </span>
                  </div>
                  {selectedLanguages[0] === lang.code && (
                    <span className='rounded bg-accent px-2 py-1 text-xs text-accent-foreground'>
                      Primary
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className='mt-4 text-muted-foreground'>
            Note: The browser will use the primary language for recognition.
            Mixed language speech may be transcribed in the primary language
            script.
          </p>
        </div>
      </div>
    </div>
  );
}
