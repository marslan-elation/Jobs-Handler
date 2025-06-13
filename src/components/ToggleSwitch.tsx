"use client";

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function ToggleSwitch({ label, checked, onChange, disabled }: ToggleSwitchProps) {
    return (
        <div className="flex items-center gap-4">
            <label className="text-sm font-medium">{label}</label>
            <button
                type="button"
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-gray-300"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}
