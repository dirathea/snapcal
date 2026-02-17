import { useState, useEffect } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEmailHistory, removeEmailFromHistory } from '@/lib/storage';

interface EmailComboboxProps {
  platform: 'google' | 'outlook';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EmailCombobox({
  platform,
  value,
  onChange,
  placeholder = 'your@email.com',
}: EmailComboboxProps) {
  const [emailHistory, setEmailHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = getEmailHistory(platform);
    setEmailHistory(history);
  }, [platform]);

  const handleRemoveEmail = (emailToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    removeEmailFromHistory(platform, emailToRemove);
    
    const updatedHistory = emailHistory.filter(
      (e) => e.toLowerCase() !== emailToRemove.toLowerCase()
    );
    setEmailHistory(updatedHistory);
  };

  return (
    <Combobox items={emailHistory}>
      <ComboboxInput
        showClear={true}
        showTrigger={true}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <ComboboxContent>
        <ComboboxEmpty>No saved emails yet</ComboboxEmpty>
        <ComboboxList>
          {(email) => (
            <ComboboxItem
              key={email}
              value={email}
              onClick={() => onChange(email)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="flex-1 truncate">{email}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => handleRemoveEmail(email, e)}
                  className="shrink-0 opacity-50 hover:opacity-100"
                  aria-label={`Remove ${email} from history`}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
